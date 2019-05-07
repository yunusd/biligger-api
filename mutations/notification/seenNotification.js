const { Notification } = require('../../models');

module.exports = async (_, args, context) => {
  args.user = context.isAuthenticated.id;

  const notification = await Notification.updateMany({ notifier: args.user }, {
    seen: true,
  });

  return { seen: !notification };
};
