const { Post, Category } = require('../../models');

module.exports = {
  getLatestPosts: async () => {
    const posts = await Post.find({}).sort({ createdAt: -1 })
      .populate('author').populate('category');
    return posts;
  },
  getLatestPostsByCategory: async (_, { category }) => {
    const { id } = await Category.findOne({ name: category });
    const posts = await Post.find({ category: id }).sort({ createdAt: -1 })
      .populate('author').populate('category');
    return posts;
  },
  getPostsByUser: async (_, { id }) => {
    const posts = await Post.find({ author: id }).sort({ createdAt: -1 })
      .populate('author');
    return posts;
  },
};
