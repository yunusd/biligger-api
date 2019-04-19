const getPost = require('./getPost');
const getLatestPosts = require('./getLatestPosts');
const getLatestPostsByCategory = require('./getLatestPostsByCategory');

module.exports = {
  Query: {
    getPost,
    getLatestPosts,
    getLatestPostsByCategory,
  },
};
