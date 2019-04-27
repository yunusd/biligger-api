const { Category } = require('../../models');

module.exports = async (_, { name }) => {
  const category = await Category.findOne({ name })
    .sort({ createdAt: -1 });
  return category;
};
