const { Confirmation } = require('../models');

const removeConfirmations = async () => {
  await Confirmation.remove({ $where: 'this.expire < Date.now()' });
};

module.exports = removeConfirmations;
