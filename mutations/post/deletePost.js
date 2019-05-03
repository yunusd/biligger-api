const { Post, Like } = require('../../models');

module.exports = async (_, args) => {
  await Like.deleteMany({ parent: args.id });
  const post = await Post.findByIdAndDelete(args.id);
  return post;
};
