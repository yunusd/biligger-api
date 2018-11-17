const Joi = require('joi');

const User = require('../../models/user');
const { signUpValidation } = require('../../validation');

module.exports = async (_, args) => {
  await Joi.validate(args, signUpValidation, { abortEarly: false });
  // Deleting passwordCheck field because mongoose schema doesn't have this field.
  delete args.passwordCheck;
  const user = new User(args);
  return user.save();
};
