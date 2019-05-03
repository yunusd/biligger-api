const { Post } = require('../../models');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated && context.isAuthenticated.id;

  const postAggregate = await Post.aggregate([
    { $match: { $text: { $search: args.text } } },
    {
      $lookup: {
        from: 'likes',
        let: { parent: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and:
                  [
                    { $eq: ['$$parent', '$parent'] },
                    { $eq: [{ $toObjectId: args.user }, '$user'] },
                  ],
              },
            },
          },
          { $project: { _id: 0, user: 1 } },
        ],
        as: 'liked',
      },
    },
    {
      $unwind: {
        path: '$liked',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        id: { $toString: '$_id' },
        title: 1,
        content: 1,
        category: 1,
        countLike: 1,
        author: 1,
        createdAt: 1,
        like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
      },
    },
    { $sort: { score: { $meta: 'textScore' } } },
    { $skip: args.offset },
    { $limit: args.limit },
  ]).exec();

  const opts = [
    { path: 'author', select: '-hashedPassword -salt' },
  ];

  const posts = await Post.populate(postAggregate, opts);

  if (!posts) return Error('Gönderi bulunamadı');
  return posts;
};
