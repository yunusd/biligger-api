const User = require('../../models/user');

module.exports = async (_, args) => User.findOne({ username: args.username });
