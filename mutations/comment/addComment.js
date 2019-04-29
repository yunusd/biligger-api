const Joi = require('joi');

const { Comment, Post } = require('../../models');
const { commentValidation } = require('../../validation');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;

  await Joi.validate(args, commentValidation, { abortEarly: false });

  const { id } = await Comment.create(args);
  const comment = await Comment.findById(id).populate('parent');

  await Post.findByIdAndUpdate(comment.parent.id, {
    $push: {
      comment: comment.id,
    },
  }, {
    new: true,
  });

  return comment;
};
