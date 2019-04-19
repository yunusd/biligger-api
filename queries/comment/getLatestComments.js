const { Comment } = require('../../models');

module.exports = async (_, args) => {
  const comments = await Comment.find({ post: args.post }).sort({ createdAt: -1 }).populate('author');
  return comments;
};
