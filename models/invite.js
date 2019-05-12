const mongoose = require('mongoose');
const nanoid = require('nanoid');

const { Schema } = mongoose;

const inviteSchema = new Schema({
  code: {
    type: String,
    default: () => nanoid(10),
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;
