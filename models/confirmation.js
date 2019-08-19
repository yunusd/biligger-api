const mongoose = require('mongoose');

const { Schema } = mongoose;

const confirmationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refPath: 'user',
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  action: {
    // Type 1: Email verify
    // Type 2: Password Reset
    type: Number,
    required: true,
  },
  expire: {
    type: Date,
    required: true,
  },
});

const Confirmation = mongoose.model('Confirmation', confirmationSchema);

module.exports = Confirmation;
