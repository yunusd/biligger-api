const mongoose = require('mongoose');
const { Post, Category } = require('../../models');

const { ObjectId } = mongoose.Types;
module.exports = {
  getLatestPosts: async (_, args, context) => {
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
          like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]).exec();

    const opts = [
      { path: 'author', select: '-hashedPassword -salt' },
      { path: 'category' },
    ];

    const posts = await Post.populate(postAggregate, opts);
    return posts;
  },
  getLatestPostsByCategory: async (_, args, context) => {
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
          like: { $eq: [{ $toObjectId: args.user }, '$liked.user'] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]).exec();

    const opts = [
      { path: 'author', select: '-hashedPassword -salt' },
      { path: 'category' },
    ];

    const posts = await Post.populate(postAggregate, opts);
    return posts;
  },
  getPostsByUser: async (_, { id }) => {
    const posts = await Post.find({ author: id }).sort({ createdAt: -1 })
      .populate('author');
    return posts;
  },
};
