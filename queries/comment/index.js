const getComment = require('./getComment');
const getLatestComments = require('./getLatestComments');
const getUserComments = require('./getUserComments');

module.exports = {
  Query: {
    getComment,
    getLatestComments,
    getUserComments,
  },
};
