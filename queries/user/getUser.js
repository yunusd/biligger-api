const { AuthenticationError } = require('apollo-server-express');
const User = require('../../models/user');

module.exports = async (_, args, context) => {
  if (!context.isAuth) throw new AuthenticationError('Unauthorized!');
  return User.findOne({ username: args.username });
};
