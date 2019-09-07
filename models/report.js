const mongoose = require('mongoose');

const { Schema } = mongoose;


const reportSchema = new Schema({
  actor: { type: mongoose.Types.ObjectId, ref: 'User' },
  reporter: { type: mongoose.Types.ObjectId, ref: 'User' },
  entity: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: 'entityRef',
  },
  entityRef: {
    type: String,
    required: true,
    enum: ['Post', 'Comment'],
  },
  entityId: {
    type: Number,
    required: true,
    // type 1: Spam,
    // type 2: Nudity, sexual harrasment etc.
    // type 3: Typing rules
    // type 4: Hate speech
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
