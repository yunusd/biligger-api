const { Like } = require('../../models');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated.id;
  const likedPosts = await Like.find({ user: args.user }, '-_id -user').populate({
    path: 'parent',
    populate: { path: 'author', select: 'username' },
  }).sort({ createdAt: -1 });
  return likedPosts;
};
