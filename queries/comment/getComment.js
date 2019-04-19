const { Comment } = require('../../models');

module.exports = async (_, args) => {
  const comment = await Comment.findById(args.id);
  return comment;
};
