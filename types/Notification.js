const Notification = `
  type NotificationData {
    actor: String
    notificationId: ID
    count: Int
    message: String
    entity: String
    entityId: Int
    seen: Boolean
    createdAt: Date
  }

  type Notification {
    notifications: [NotificationData]
    count: Int
  }

  type Seen {
    seen: Boolean
  }
  
  extend type Query {
    getNotifications(offset: Int!, limit: Int!): Notification @hasScope(actions: ["view_notification"])
  }

  extend type Mutation {
    seenNotification: Seen @hasScope(actions: ["view_notification"])
    deleteNotification: Seen @hasScope(actions: ["delete_notification"])
  }
`;

module.exports = Notification;
