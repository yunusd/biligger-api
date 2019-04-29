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
  like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
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
