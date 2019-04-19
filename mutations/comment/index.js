const addComment = require('./addComment');
const editComment = require('./editComment');
const deleteComment = require('./deleteComment');


module.exports = {
  Mutation: {
    addComment,
    editComment,
    deleteComment,
  },
};
