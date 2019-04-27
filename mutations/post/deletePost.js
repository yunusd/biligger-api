const { Post } = require('../../models');

module.exports = async (_, args) => {
  const post = await Post.findByIdAndDelete(args.id);
  return post;
};
