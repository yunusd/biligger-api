const seenNotification = require('./seenNotification');
const deleteNotification = require('./deleteNotification');

module.exports = {
  Mutation: {
    seenNotification,
    deleteNotification,
  },
};
