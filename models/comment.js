const mongoose = require('mongoose');

const { Schema } = mongoose;


const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
