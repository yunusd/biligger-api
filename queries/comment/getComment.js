const { Comment } = require('../../models');

module.exports = async (_, args) => {
  const {
    id,
    content,
    like,
    parent,
    parentModel,
    author,
    createdAt,
  } = await Comment.findById(args.id)
    .populate({ path: 'parent', populate: { path: 'author' } })
    .populate('author');

  /**
   * New object with property
   * parent.post and parent.comment
   *
   */
  const data = {
    id,
    content,
    like,
    author,
    createdAt,
    parentModel,
    parent: {
      post: parentModel === 'Post' && parent,
      comment: parentModel === 'Comment' && parent,
    },
  };

  return data;
};
