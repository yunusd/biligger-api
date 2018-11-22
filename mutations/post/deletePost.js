const { Post } = require('../../models');

module.exports = async (_, args) => Post.findByIdAndDelete(args.id);
