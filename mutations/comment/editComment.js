const { Comment } = require('../../models');

module.exports = async (_, args, context) => {
  args.author = context.isAuthenticated.id;
  // validate with Joi.validate
  const comment = await Comment.findByIdAndUpdate(args.id, {
    content: args.content,
  }, { new: true });

  return comment || new Error('Yorum yok!');
};
