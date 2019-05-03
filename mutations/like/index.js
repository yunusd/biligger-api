const addLike = require('./addLike');
const removeLike = require('./removeLike');

module.exports = {
  Mutation: {
    addLike,
    removeLike,
  },
};
