const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const validate = require('./validate');

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy((username, password, done) => {
/**
 * Letter İ(uppercase) can't be transform to i(lowercase) via toLowerCase().
 * Instead we need a Turkish-specific case conversion,
 * available with String#toLocaleLowerCase
 * but I didn't use that function because all usernames compatible with English.
 * So instead of that I did use replace() function to replacing
 * uppercase İ with lowercase i.
 * Also whitespaces removed from username before querying the user
 */
  User.findOne({ username: username.replace(/ /g, '').replace(/İ/g, 'i').toLowerCase() })
    .exec()
    .then(user => validate.user(user, password))
    .then(user => done(null, user, { scope: user.roles }))
    .catch(() => done(null, false));
}));

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// user object is serialized into the session.  Typically this will be a
// simple matter of serializing the user's ID, and deserializing by finding
// the user by ID from the database.

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => user)
    .then(user => done(null, user))
    .catch(err => done(err));
});
