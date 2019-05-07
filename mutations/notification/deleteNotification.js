const { Notification } = require('../../models');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated.id;

  const notification = await Notification.deleteMany({ notifier: args.user });

  return { seen: !notification };
};
