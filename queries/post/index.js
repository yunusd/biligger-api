const getPost = require('./getPost');
const getLatestPosts = require('./getLatestPosts');

module.exports = {
  Query: {
    getPost,
    getLatestPosts,
  },
};
