const { Post } = require('../../models');

module.exports = async (_, args) => Post.findOne(args);
