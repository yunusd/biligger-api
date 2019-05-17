const { Post, Comment, Like } = require('../../models');
const { deleteNotification } = require('../../helpers/notification');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  const comment = await Comment.findByIdAndDelete(args.id);
  if (comment) {
    // const decreaseCountReply = args.parentModel !== 'Post'
    //   ? await Post.findByIdAndUpdate(args.parent.id, { $inc: { countReply: -1 } })
    //   : await Comment.findByIdAndUpdate(args.parent.id, { $inc: { countReply: -1 } });
    await Like.deleteMany({ parent: args.id });
    await Post.findByIdAndUpdate(args.parent, { $inc: { countReply: -1 } });
    await Comment.findByIdAndUpdate(args.parent, { $inc: { countReply: -1 } });
    await deleteNotification(args.author, comment.author);
  }
  return comment || new Error('İçerik yok!');
};
