const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;
/**
 * This is the configuration of the users that are allowed to connected to your authorization
 * server. These represent users of different client applications that can connect to the
 * authorization server. At a minimum you need the required properties of
 *
 * id       : A unique numeric id of your user
 * username : The user name of the user
 * hashedPassword : The hashedPassword of your user
 * password : Virtual field for plain password. Won't be storage in db
 * name     : The name of your user
 * roles    : By default it's set to 'user'. Defining roles/permissions on the site of the user.
 */

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: async username => await User.where({ username }).countDocuments() === 0,
      message: ({ value }) => `Username (${value}) has already been taken.`,
    },
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator: async email => await User.where({ email }).countDocuments() === 0,
      message: ({ value }) => `Email (${value}) has already been taken.`,
    },
  },
  degree: {
    type: String,
    required: true,
  },
  bio: String,
  roles: {
    type: String,
    default: 'user',
    required: true,
  },
});

userSchema.pre('save', function (next) {
  if (this.roles !== 'user') this.roles = 'user';
  next();
});

userSchema.methods.encryptPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 100000, 32, 'sha256');
};

userSchema.virtual('password').set(function (password) {
  this.salt = crypto.randomBytes(128).toString('hex');
  this.hashedPassword = this.encryptPassword(password);
});

userSchema.methods.verifyPassword = function (password) {
  return this.encryptPassword(password) == this.hashedPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
