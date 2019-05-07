const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema({
  actor: { type: mongoose.Types.ObjectId, ref: 'User' },
  notifier: { type: mongoose.Types.ObjectId, ref: 'User' },
  entity: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'parentModel',
  },
  entityRef: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
  },
  entityId: {
    type: Number,
    required: true,
    // type 1 = Liked a Post,
    // type 2 = Liked a Comment,
    // type 3 = Commented a Post,
    // type 4 = Commented a Comment,
  },
  message: String,
  seen: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
