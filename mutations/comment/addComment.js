const Joi = require('joi');

const {
  Comment, Post, User,
} = require('../../models');

const { createNotification } = require('../../helpers/notification');

const { commentValidation } = require('../../validation');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;

  await Joi.validate(args, commentValidation, { abortEarly: false });

  const { id } = await Comment.create(args);
  const comment = await Comment.findById(id).populate('parent');
  if (comment.parentModel === 'Comment') await Comment.findByIdAndUpdate(comment.parent.id, { $inc: { mainScore: 0.5, countReply: 1 } });
  await Post.findByIdAndUpdate(comment.parent.id, {
    $push: {
      comment: comment.id,
    },
    $inc: {
      mainScore: 0.5,
      countReply: 1,
    },
  }, {
    new: true,
  });

  await User.findByIdAndUpdate(args.user, {
    $inc: {
      mainScore: 0.5,
    },
  });

  await createNotification(args.author, comment.parent.author, {
    entity: comment.parent.id,
    entityRef: comment.parent.title ? 'Post' : 'Comment',
    entityChild: comment.id,
    entityId: comment.parent.title ? 3 : 4,
    message: comment.content,
  });

  return comment;
};
