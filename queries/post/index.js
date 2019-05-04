const getPost = require('./getPost');
const { getLatestPosts, getLatestPostsByCategory, getPostsByUser } = require('./getLatestPosts');
const { getPopulerPosts, getPopulerPostsByCategory } = require('./getPopulerPosts');

module.exports = {
  Query: {
    getPost,
    getLatestPosts,
    getLatestPostsByCategory,
    getPostsByUser,
    getPopulerPosts,
    getPopulerPostsByCategory,
  },
};
