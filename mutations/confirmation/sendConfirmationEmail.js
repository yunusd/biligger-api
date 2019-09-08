const { User, Confirmation } = require('../../models');
const { createHash, sendEmail } = require('../../auth/utils');

module.exports.sendConfirmationEmail = async (_, args) => {
  const user = await User.findOne({ email: args.email });
  const confirmation = await Confirmation.findOne({
    userId: user.id, action: args.action,
  });
  if (confirmation) {
    if (confirmation.expire > Date.now()) return false;
  }
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
