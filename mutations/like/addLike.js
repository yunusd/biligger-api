const {
  Comment, Post, User, Like,
} = require('../../models');

const { createNotification } = require('../../helpers/notification');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated.id;
  let post = null;
  let comment = null;
  let userLike = null;
  let like = null;
  userLike = await Like.findOne({
    parent: args.id,
    user: args.user,
  });

  if (!userLike) {
    like = await Like.create({
      user: args.user,
      parent: args.id,
      parentModel: args.parentModel,
    });
    /**
     * like: { $ne: args.user }
     * Selects the documents where the value of the like is not equal to the user id.
     * This prevents duplicated likes.
    */
    // eslint-disable-next-line no-nested-ternary
    if (args.parentModel === 'Post') {
      post = await Post.findOneAndUpdate({
        _id: args.id,
        like: { $ne: like.id },
      }, {
        $push: {
          like: like.id,
        },
        $inc: {
          mainScore: 0.1,
          countLike: 1,
        },
      }, {
        new: true,
        useFindAndModify: false,
      });
      await User.findByIdAndUpdate(post.author, {
        $inc: {
          mainScore: 0.1,
        },
      });
      await createNotification(args.user, post.author, {
        entity: post.id,
        entityRef: 'Post',
        entityId: 1,
        message: post.title,
      });
    }
    if (args.parentModel === 'Comment') {
      comment = await Comment.findOneAndUpdate({
        _id: args.id,
        like: { $ne: like.id },
      }, {
        $push: {
          like: like.id,
        },
        $inc: {
          mainScore: 0.1,
          countLike: 1,
        },
      }, {
        new: true,
        useFindAndModify: false,
      });
      await User.findByIdAndUpdate(comment.author, {
        $inc: {
          mainScore: 0.1,
        },
      });
      await createNotification(args.user, comment.author, {
        entity: comment.id,
        entityRef: 'Comment',
        entityId: 2,
        message: comment.content,
      });
    }
  }
  return {
    liked: !!post || !!comment,
  };
};
