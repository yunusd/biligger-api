const User = require('../../models/user');

module.exports = async (...args) => {
  const [, , context] = args;
  const user = await User.findById(context.isAuthenticated.id);
  return user;
};
