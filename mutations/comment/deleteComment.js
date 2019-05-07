const { Comment, Like } = require('../../models');
const { deleteNotification } = require('../../helpers/notification');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  await Like.deleteMany({ parent: args.id });
  const comment = await Comment.findByIdAndDelete(args.id);
  await deleteNotification(args.author, comment.author);
  return comment || new Error('İçerik yok!');
};
