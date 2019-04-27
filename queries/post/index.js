const getPost = require('./getPost');
const { getLatestPosts, getLatestPostsByCategory, getPostsByUser } = require('./getLatestPosts');

module.exports = {
  Query: {
    getPost,
    getLatestPosts,
    getLatestPostsByCategory,
    getPostsByUser,
  },
};
