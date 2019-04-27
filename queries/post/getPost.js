const { Post } = require('../../models');

module.exports = async (_, args) => {
  const post = await Post.findById(args.id).populate('author');
  if (!post) return Error('Gönderi bulunamadı');
  return post;
};
