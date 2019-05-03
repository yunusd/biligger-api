const { Post } = require('../../models');

module.exports = async (_, args) => {
  const postAggregate = await Post.aggregate([
    { $match: { $text: { $search: args.text } } },
    {
      $project: {
        id: { $toString: '$_id' },
        title: 1,
        content: 1,
        category: 1,
        countLike: 1,
        author: 1,
        createdAt: 1,
        liked: { $in: [{ $toObjectId: '5cc86ed1001dcfb3d164e8f5' }, '$like'] },
      },
    },
    { $sort: { score: { $meta: 'textScore' } } },
  ]).exec();
  const opts = [
    { path: 'author', select: '-hashedPassword -salt' },
  ];

  const posts = await Post.populate(postAggregate, opts);

  if (!posts) return Error('Gönderi bulunamadı');
  return posts;
};
