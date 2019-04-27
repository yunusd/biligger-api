const { Comment } = require('../../models');

module.exports = async (_, args) => {
  const comments = await Comment.find({ author: args.author }).sort({ createdAt: -1 }).populate('post');
  return comments;
};
