const { Post } = require('../../models');

module.exports = async () => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).populate('author');
  return posts;
};
