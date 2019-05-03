const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: String,
  like: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  countLike: {
    type: Number,
    default: 0,
  },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  mainScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index(
  { title: 'text', content: 'text' },
  { weights: { title: 10, content: 7 }, name: 'post index search' },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
