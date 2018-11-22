const addPost = require('./addPost');
const editPost = require('./editPost');
const deletePost = require('./deletePost');

module.exports = {
  Mutation: {
    addPost,
    editPost,
    deletePost,
  },
};
