const mongoose = require('mongoose');

const { Schema } = mongoose;

const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
