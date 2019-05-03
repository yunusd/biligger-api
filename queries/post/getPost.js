const mongoose = require('mongoose');
const { Post } = require('../../models');

const { ObjectId } = mongoose.Types;

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated && context.isAuthenticated.id;

  const postAggregate = await Post.aggregate([
    { $match: { _id: ObjectId(args.id) } },
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
        title: '$title',
        content: '$content',
        category: '$category',
        countLike: '$countLike',
        author: '$author',
        createdAt: '$createdAt',
        like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
      },
    },
    { $limit: 1 },
  ]).exec();

  const opts = [
    { path: 'author', select: '-hashedPassword -salt' },
    { path: 'category' },
  ];

  const post = await Post.populate(postAggregate, opts);
  if (!post.length) return Error('Gönderi bulunamadı');
  return post[0];
};
