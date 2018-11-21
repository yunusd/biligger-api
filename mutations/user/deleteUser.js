const { User } = require('../../models');

module.exports = async (_, args, context) => User.findByIdAndRemove(context.isAuthenticated.id);
