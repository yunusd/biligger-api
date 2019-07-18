const { Notification } = require('../models');

module.exports = {
  createNotification: async (actor, notifier, opts) => {
    const {
      entity, entityChild, entityRef, entityId, message,
    } = opts;
    if (notifier !== actor) {
      await Notification.create({
        actor,
        notifier,
        entity,
        entityChild,
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
