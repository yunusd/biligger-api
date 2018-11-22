const Joi = require('joi');

const { Post } = require('../../models');
const { editPostValidation } = require('../../validation');

module.exports = async (_, args) => {
  await Joi.validate(args, editPostValidation, { abortEarly: false });

  const post = await Post.findByIdAndUpdate(args.id, {
    title: args.title,
    content: args.content,
    url: args.url,
  }, { new: true });

  return post;
};
