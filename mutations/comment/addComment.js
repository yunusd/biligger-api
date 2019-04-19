const { Comment, Post } = require('../../models');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  // validate with Joi.validate
  const comment = await Comment.create(args);
  await Post.findByIdAndUpdate(comment.post, {
    $push: {
      comment: comment.id,
    },
  }, {
    new: true,
  });

  return comment;
};
