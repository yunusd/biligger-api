const User = require('../../models/user');

module.exports = async (_, args) => User.findById(args.id);
