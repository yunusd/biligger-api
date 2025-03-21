const {
  Comment, Post, User, Like,
} = require('../../models');

const { deleteNotification } = require('../../helpers/notification');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated.id;
  let post = null;
  let comment = null;

  const like = await Like.findOneAndDelete({
    parent: args.id,
  });

  if (like) {
    /**
     * like: { $ne: args.user }
     * Selects the documents where the value of the like is not equal to the user id.
     * This prevents duplicated likes.
    */
    // eslint-disable-next-line no-nested-ternary
    if (args.parentModel === 'Post') {
      post = await Post.findOneAndUpdate({
        _id: args.id,
        like: like.id,
      }, {
        $pull: {
          like: like.id,
        },
        $inc: {
          mainScore: -0.1,
          countLike: -1,
        },
      }, {
        new: true,
        useFindAndModify: false,
      });
      await User.findByIdAndUpdate(post.author, {
        $inc: {
          mainScore: -0.1,
        },
      });
      await deleteNotification(args.user, post.author);
    }
    if (args.parentModel === 'Comment') {
      comment = await Comment.findOneAndUpdate({
        _id: args.id,
        like: like.id,
      }, {
        $pull: {
          like: like.id,
        },
        $inc: {
          mainScore: -0.1,
          countLike: -1,
        },
      }, {
        new: true,
        useFindAndModify: false,
      });
      await User.findByIdAndUpdate(comment.author, {
        $inc: {
          mainScore: -0.1,
        },
      });
    }
  }

  return {
    liked: !!post || !!comment,
  };
};
