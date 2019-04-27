const crypto = require('crypto');

module.exports = async function encryptPassword(password) {
  const salt = await crypto.randomBytes(128).toString('hex');
  const hashedPassword = await crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return {
    salt,
    hashedPassword,
  };
};
