const { Comment } = require('../../models');

module.exports = async (f, args) => {
  const comments = await Comment.find({ author: args.author })
    .populate({ path: 'parent', populate: { path: 'author' } })
    .populate('author')
    .skip(args.offset)
    .limit(args.limit)
    .sort({ createdAt: -1 });

  return comments;
};
