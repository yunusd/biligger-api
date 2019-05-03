const mongoose = require('mongoose');

const { Schema } = mongoose;


const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  like: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  countLike: {
    type: Number,
    default: 0,
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'parentModel',
  },
  parentModel: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
  },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mainScore: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
