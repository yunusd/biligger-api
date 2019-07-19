const mongoose = require('mongoose');

const { Comment } = require('../../models');

const { ObjectId } = mongoose.Types;

module.exports = async (u, args, context) => {
  args.user = context.isAuthenticated && context.isAuthenticated.id;

  const commentAggregate = await Comment.aggregate([
    { $match: { parent: ObjectId(args.parent) } },
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
        content: '$content',
        countLike: '$countLike',
        countReply: '$countReply',
        author: '$author',
        createdAt: '$createdAt',
        parentModel: '$parentModel',
        parent: {
          post: {
            $cond: {
              if: { $eq: ['Comment', '$parentModel'] },
              then: '$$REMOVE',
              else: '$parent',
            },
          },
          comment: {
            $cond: {
              if: { $eq: ['Post', '$parentModel'] },
              then: '$$REMOVE',
              else: '$parent',
            },
          },
        },
        like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: args.offset },
    { $limit: args.limit },
  ]).exec();

  const opts = [
    { path: 'author', select: '-hashedPassword -salt' },
    { path: 'parent', populate: { path: 'author' } },
  ];

  const comments = await Comment.populate(commentAggregate, opts);

  if (!comments) return Error('Gönderi bulunamadı');
  return comments;
};
