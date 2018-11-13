const Joi = require('joi');

const User = require('../../models/user');
const { signUpValidation } = require('../../validation');

module.exports = async (_, args) => {
  await Joi.validate(args, signUpValidation, { abortEarly: false });
  const user = new User(args);
  return user.save();
};
