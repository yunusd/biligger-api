const User = require('../../models/user');

module.exports = async (_, args) => {
  const user = await User.findOne({ username: args.username });
  if (!user) return Error('Kullanıcı bulunamadı!');
  return user;
};
