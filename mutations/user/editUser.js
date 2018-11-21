const Joi = require('joi');
const User = require('../../models/user');
const encrypt = require('../../helpers/encrypt');

const { editUserValidation } = require('../../validation');

module.exports = async (_, args, context) => {
  // If registired email and given email doesn't equal will try to find that user
  // and if it finds, return error.
  if (context.isAuthenticated.email !== args.email) {
    const emailExists = await User.findOne({ email: args.email });
    if (emailExists) throw Error('E-Posta zaten var');
  }

  // Validate inputs
  await Joi.validate(args, editUserValidation, { abortEarly: false });

  // Encryption proccess is handled by module.
  // Because mongoose doesn't support update virtual fields.
  // TODO: Implement update virtual fields when mongoose support.
  const pass = await encrypt(args.password);

  // Finding user with given query and
  // because of 'new:true' option return updated user.
  const user = await User.findByIdAndUpdate(context.isAuthenticated.id, {
    salt: pass.salt,
    hashedPassword: pass.encryptedPassword,
    email: args.email,
    degree: args.degree,
    bio: args.bio,
  }, { new: true }).exec();

  return user;
};
