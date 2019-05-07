const Notification = `
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
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
    getNotifications(offset: Int!, limit: Int!): Notification @hasScope(actions: ["edit_comment"])
  }

  extend type Mutation {
    seenNotification: Seen @hasScope(actions: ["edit_comment"])
    deleteNotification: Seen @hasScope(actions: ["edit_comment"])
  }
`;

module.exports = Notification;
