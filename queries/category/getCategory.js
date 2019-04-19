const { Category } = require('../../models');

module.exports = async (_, args) => {
  const category = await Category.findById(args.id);
  return category;
};
