const { Category } = require('../../models');

module.exports = async () => (Category.find({}));
