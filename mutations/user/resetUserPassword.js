const { Confirmation } = require('../../models');
const { resetPassword, verifyHash } = require('../../auth/utils');

module.exports = async (_, args) => {
  const { userId = false, hash, expired } = await verifyHash({ hash: args.hash, action: 2 });

  if (!hash || expired) return new Error('Hash doğrulanamadı');
  await Confirmation.findOneAndRemove({ hash: args.hash });

  args.userId = userId;
  return resetPassword(args);
};
