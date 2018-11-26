const Joi = require('joi');

const { Post } = require('../../models');
const { postValidation } = require('../../validation');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  await Joi.validate(args, postValidation, { abortEarly: false });
  const post = await Post.create(args);
  return post;
};
