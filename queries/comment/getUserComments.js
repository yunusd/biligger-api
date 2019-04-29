const _ = require('lodash');
const { Comment } = require('../../models');

module.exports = async (f, args) => {
  const comments = await Comment.find({ author: args.author })
    .populate({ path: 'parent', populate: { path: 'author' } }).populate('author');

  /**
   * Returning new array of object with property
   * parent.post and parent.comment
   *
   */
  const data = [];
  _.each(comments, (obj) => {
    const {
      id,
      content,
      like,
      parent,
      parentModel,
      author,
      createdAt,
    } = obj;

    const newData = {
      id,
      content,
      like,
      author,
      createdAt,
      parentModel,
      parent: {
        post: parentModel === 'Post' && parent,
        comment: parentModel === 'Comment' && parent,
      },
    };
    data.push(newData);
  });

  return data;
};
