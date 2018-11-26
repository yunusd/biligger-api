const { RBAC } = require('rbac');

module.exports = new RBAC({
  roles: ['admin', 'moderator', 'user', 'guest'],
  permissions: {
    user: ['create', 'edit', 'delete', 'ban'],
    post: ['create', 'read', 'edit', 'delete', 'remove'],
  },
  grants: {
    guest: ['create_user', 'read_post'],
    user: ['create_post', 'edit_post', 'delete_post'],
    moderator: ['user', 'ban_user', 'remove_post'],
    admin: ['moderator'],
  },
});
