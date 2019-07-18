const mongoose = require('mongoose');
const { Notification } = require('../../models');

const { ObjectId } = mongoose.Types;

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated && context.isAuthenticated.id;

  const count = await Notification.find({ notifier: args.user, actor: { $ne: args.user }, seen: false }, 'seen');

  const notificationAggregation = await Notification.aggregate([
    { $match: { notifier: ObjectId(args.user), actor: { $nin: [ObjectId(args.user), '$notifier'] } } },
    {
      $lookup: {
        from: 'users',
        let: { actor: '$actor' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and:
                    [
                      { $eq: ['$$actor', '$_id'] },
                    ],
              },
            },
          },
          { $project: { _id: 0, username: 1 } },
        ],
        as: 'actor',
      },
    },
    {
      $unwind: {
        path: '$actor',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: { entity: '$entity', entityId: '$entityId' },
        actor: { $last: '$actor.username' },
        notificationId: { $last: { $toString: '$_id' } },
        count: { $sum: 1 },
        message: { $last: '$message' },
        entity: { $last: { $toString: '$entity' } },
        entityChild: { $last: { $toString: '$entityChild' } },
        entityId: { $last: '$entityId' },
        seen: { $last: '$seen' },
        createdAt: { $last: '$createdAt' },
      },
    },
    {
      $sort: { notificationId: -1 },
    },
    { $skip: args.offset },
    { $limit: args.limit },
  ]);

  return {
    notifications: notificationAggregation,
    count: count.length,
  };
};
