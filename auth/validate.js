const process = require('process'); // For supress tracing
const logger = require('../config/winston');

const {
  User,
} = require('../models');

/** Validate object to attach all functions to  */
const validate = Object.create(null);

/** Suppress tracing for things like unit testing */
const supressTrace = process.env.OAUTHRECIPES_SURPRESS_TRACE === 'true';

/**
 * Log the message and throw it as an Error
 * @param   {String} msg - Message to log and throw
 * @throws  {Error}  The given message as an error
 * @returns {undefined}
 */
validate.logAndThrow = (msg) => {
  if (!supressTrace) {
    logger.error(msg);
  }
  throw new Error(msg);
};

/**
 * Given a user and a password this will return the user if it exists and the password matches,
 * otherwise this will throw an error
 * @param   {Object} user     - The user profile
 * @param   {String} password - The user's password
 * @throws  {Error}  If the user does not exist or the password does not match
 * @returns {Object} The user if valid
 */
validate.user = (user, password) => {
  validate.userExists(user);
  return User.findById(user.id).exec()
    .then((dbUser) => {
      if (!dbUser.verifyPassword(password)) {
        return validate.logAndThrow('User password does not match');
      }
      return dbUser;
    });
};

/**
 * Given a user this will return the user if it exists otherwise this will throw an error
 * @param   {Object} user - The user profile
 * @throws  {Error}  If the user does not exist or the password does not match
 * @returns {Object} The user if valid
 */
validate.userExists = (user) => {
  if (user == null) {
    return validate.logAndThrow('User does not exist');
  }
  return user;
};

module.exports = validate;
