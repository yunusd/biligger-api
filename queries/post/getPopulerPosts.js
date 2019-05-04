const mongoose = require('mongoose');
const { Post, Category } = require('../../models');

const { ObjectId } = mongoose.Types;
module.exports = {
  getPopulerPosts: async (_, args, context) => {
    args.user = context.isAuthenticated && context.isAuthenticated.id;

    const postAggregate = await Post.aggregate([
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
          mainScore: {
          /**
           *  The Score Algorithm Example:
           *  return (likes || comment - 1) / pow((itemHourAge + 2), gravity);
           *  The score will be decrease as item hour age increase. Older items get lower scores.
           *  gravity defines the speed of aging.
           */
            $let: {
              vars: {
                countLike: '$countLike',
                countComment: { $size: '$comment' },
                time: {
                  $divide: [
                    {
                      $abs:
                      {
                        $subtract: [new Date(), '$createdAt'],
                      },
                    },
                    36e5,
                  ],
                },
              },

              in: {
                $add: [
                  { $divide: [{ $subtract: ['$$countLike', 1] }, { $pow: [{ $add: ['$$time', 2] }, 1.8] }] },
                  { $divide: [{ $subtract: ['$$countComment', 1] }, { $pow: [{ $add: ['$$time', 2] }, 1.5] }] },
                ],
              },
            },
          },
          like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
        },
      },
      { $sort: { mainScore: -1 } },
      { $skip: args.offset },
      { $limit: args.limit },
    ]).exec();

    const opts = [
      { path: 'author', select: '-hashedPassword -salt' },
      { path: 'category' },
    ];

    const posts = await Post.populate(postAggregate, opts);

    return posts;
  },
  getPopulerPostsByCategory: async (_, args, context) => {
    args.user = context.isAuthenticated && context.isAuthenticated.id;
    const { id } = await Category.findOne({ name: args.category });

    const postAggregate = await Post.aggregate([
      { $match: { category: ObjectId(id) } },
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
          mainScore: {
            /**
             *  The Score Algorithm Example:
             *  return (likes || comment - 1) / pow((itemHourAge + 2), gravity);
             *  The score will be decrease as item hour age increase. Older items get lower scores.
             *  gravity defines the speed of aging.
             */
            $let: {
              vars: {
                countLike: '$countLike',
                countComment: { $size: '$comment' },
                time: {
                  $divide: [
                    {
                      $abs:
                        {
                          $subtract: [new Date(), '$createdAt'],
                        },
                    },
                    36e5,
                  ],
                },
              },

              in: {
                $add: [
                  { $divide: [{ $subtract: ['$$countLike', 1] }, { $pow: [{ $add: ['$$time', 2] }, 1.8] }] },
                  { $divide: [{ $subtract: ['$$countComment', 1] }, { $pow: [{ $add: ['$$time', 2] }, 1.5] }] },
                ],
              },
            },
          },
          like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
        },
      },
      { $sort: { mainScore: -1 } },
      { $skip: args.offset },
      { $limit: args.limit },
    ]).exec();

    const opts = [
      { path: 'author', select: '-hashedPassword -salt' },
      { path: 'category' },
    ];

    const posts = await Post.populate(postAggregate, opts);
    return posts;
  },
};
