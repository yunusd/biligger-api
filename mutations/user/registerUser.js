const User = require('../../models/user');

module.exports = async (_, args) => {
  const user = new User(args);
  return user.save();
};
