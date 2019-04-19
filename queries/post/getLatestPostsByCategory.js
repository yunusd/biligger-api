const { Post } = require('../../models');

module.exports = async (_, args) => {
  const posts = await Post.find({ category: args.category })
    .sort({ createdAt: -1 })
    .populate('author')
    .populate('category');
  return posts;
};
