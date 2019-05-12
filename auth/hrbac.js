const { RBAC } = require('rbac');

module.exports = new RBAC({
  roles: ['admin', 'moderator', 'user', 'guest'],
  permissions: {
    user: ['create', 'edit', 'delete', 'ban', 'view'],
    post: ['create', 'read', 'edit', 'delete', 'remove'],
    comment: ['create', 'read', 'edit', 'delete', 'remove'],
    like: ['create', 'delete', 'view'],
    notification: ['view', 'delete'],
  },
  grants: {
    guest: ['create_user', 'read_post'],
    user: [
      // POST
      'create_post',
      'edit_post',
      'remove_post',
      // COMMENT
      'create_comment',
      'edit_comment',
      'remove_comment',
      // USER
      'edit_user',
      'view_user',
      // LIKE
      'create_like',
      'delete_like',
      'view_like',
      // NOTIFICATION
      'view_notification',
      'delete_notification',
    ],
    moderator: ['user', 'ban_user'],
    admin: ['moderator'],
  },
});
