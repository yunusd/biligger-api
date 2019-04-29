const Joi = require('joi');

const { Comment } = require('../../models');
const { editCommentValidation } = require('../../validation');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;

  await Joi.validate(args, editCommentValidation, { abortEarly: false });

  const comment = await Comment.findByIdAndUpdate(args.id, {
    content: args.content,
  }, { new: true });

  return comment || new Error('Yorum yok!');
};
