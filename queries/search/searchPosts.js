const { Post } = require('../../models');

module.exports = async (_, args) => {
  const post = await Post.find(
    { $text: { $search: args.text } },
    { score: { $meta: 'textScore' } },
  ).sort({ score: { $meta: 'textScore' } }).populate('author');
  console.log(post);
  if (!post) return Error('Gönderi bulunamadı');
  return post;
};
