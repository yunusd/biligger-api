const Joi = require('joi');
const User = require('../../models/user');
const encrypt = require('../../helpers/encrypt');
const validate = require('../../auth/validate');

const {
  editUserPassword, editUserEmail, editUserDegree, editUserBio,
} = require('../../validation');

module.exports = async (_, args, context) => {
  const {
    password,
    newPassword,
    newPasswordCheck,
    email,
    degree,
    bio,
  } = args;

  await validate.user({ id: context.isAuthenticated.id }, password);

  // If registired email and given email doesn't equal will try to find that user
  // and if it finds, return error.

  if (context.isAuthenticated.email !== email || context.isAuthenticated.email === email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) throw Error('E-Posta zaten var');
  }

  let pass = null;

  // Validate inputs
  if (newPassword) {
    await Joi.validate({ newPassword, newPasswordCheck }, editUserPassword, { abortEarly: false });

    // Encryption proccess is handled by module.
    // Because mongoose doesn't support update virtual fields.
    // TODO: Implement update virtual fields when mongoose support.
    // const pass = await encrypt(password);
    pass = await encrypt(newPassword);
  }
  if (email) await Joi.validate({ email }, editUserEmail, { abortEarly: false });
  if (degree) await Joi.validate({ degree }, editUserDegree, { abortEarly: false });
  if (bio) await Joi.validate({ bio }, editUserBio, { abortEarly: false });

  /**
   *
   * @param {Object} object contains data to construct
   * @param {Object} hash if hash exist will be joining to newObject
   * @param {Array} exclude Property of exclude contains that needs to not be in the newObject
   *
   * Constructing new object. If given object have empty property
   * it will not be includes to newObject.
   */
  const constructData = async (object, hash, exclude) => {
    if (exclude.length > 2) return Error('[exclude] is an array argument and only accept two value');

    const array = Object.keys(object);
    const newObject = hash || {};

    array.map(async (val) => {
      if (args[val] && val !== exclude[0] && val !== exclude[1]) {
        Object.assign(newObject, { [val]: args[val] });
      }
    });
    return newObject;
  };
  const hash = pass || null;
  const data = await constructData(args, hash, ['newPassword', 'newPasswordCheck']);

  // Finding user with given query and
  // because of 'new:true' option return updated user.
  const user = await User.findByIdAndUpdate(context.isAuthenticated.id, data, { new: true }).exec();

  return user;
};
