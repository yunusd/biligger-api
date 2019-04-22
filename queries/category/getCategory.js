const { Category } = require('../../models');

module.exports = async () => {
  const category = await Category.find({});
  return category;
};
