const { Comment } = require('../../models');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  const comment = await Comment.findByIdAndDelete(args.id);
  return comment || new Error('İçerik yok!');
};
