const { User } = require('../../models');
const { createHash, sendEmail } = require('../../auth/utils');

module.exports.sendConfirmationEmail = async (_, args) => {
  const user = await User.findOne({ email: args.email });
  // if (!user) return new Error('Kullanıcı bulunamadı!');

  delete args.email;
  args.userId = user.id;

  const { hash } = await createHash(args);
  if (hash) {
    await sendEmail(args.action, { hash, user });
  }
  return {
    hash: !!hash,
    expired: false,
  };
};
