const { RBAC } = require('rbac');

module.exports = new RBAC({
  roles: ['admin', 'moderator', 'user', 'guest'],
  permissions: {
    user: ['create', 'edit', 'delete', 'ban'],
    post: ['create', 'read', 'edit', 'delete', 'remove'],
    comment: ['create', 'read', 'edit', 'delete'],
  },
  grants: {
    guest: ['create_user', 'read_post'],
    user: ['create_post', 'edit_post', 'delete_post', 'create_comment', 'edit_comment', 'delete_comment'],
    moderator: ['user', 'ban_user', 'remove_post'],
    admin: ['moderator'],
  },
});
