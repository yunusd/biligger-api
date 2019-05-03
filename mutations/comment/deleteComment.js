const { Comment, Like } = require('../../models');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  await Like.deleteMany({ parent: args.id });
  const comment = await Comment.findByIdAndDelete(args.id);
  return comment || new Error('İçerik yok!');
};
