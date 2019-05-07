const { Notification } = require('../models');

module.exports = {
  createNotification: async (actor, notifier, opts) => {
    const {
      entity, entityRef, entityId, message,
    } = opts;
    if (notifier !== actor) {
      await Notification.create({
        actor,
        notifier,
        entity,
        entityRef,
        entityId,
        message,
      });
    }
    return null;
  },
  deleteNotification: async (actor, notifier) => (
    notifier !== actor ? Notification.deleteOne({ actor }) : null
  ),
  deleteAllNotifications: async notifier => Notification.deleteMany({ notifier }),
};
