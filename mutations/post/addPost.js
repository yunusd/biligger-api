const Joi = require('joi');

const { Post } = require('../../models');
const { postValidation } = require('../../validation');

module.exports = async (_, args) => {
  await Joi.validate(args, postValidation, { abortEarly: false });
  const post = await Post.create(args);
  return post;
};
