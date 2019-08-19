const { verifyHash, activateUser } = require('../../auth/utils');

module.exports = async (_, args) => {
  const response = await verifyHash(args);
  if (response.hash) {
    await activateUser(response.userId);
  }
  return response;
};
