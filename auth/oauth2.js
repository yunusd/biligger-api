// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.
const passport = require('passport');
const oauth2orize = require('oauth2orize');

const config = require('../config');
const { Users, RefreshTokens } = require('../models');
const validate = require('./validate');


// Create oAuth2 server
const server = oauth2orize.createServer();

// Configured expiresIn
const expiresIn = { expires_in: config.token.expiresIn };

/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
  Users.findOne({ username })
    .exec()
    .then(user => validate.user(user, password))
    .then(user => validate.generateTokens({
      userID: user.id, clientID: client.clientId, scope,
    }))
    .then((tokens) => {
      if (tokens === false) return done(null, false);
      if (tokens.length === 1) return done(null, tokens[0], null, expiresIn);
      if (tokens.length === 2) return done(null, tokens[0], tokens[1], expiresIn);
      throw new Error('Error exchanging password for tokens');
    })
    .catch(err => done(err, false));
}));

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  RefreshTokens.find(refreshToken)
    .then((foundRefreshToken) => {
      validate.refreshToken(foundRefreshToken, refreshToken, client);
      return foundRefreshToken;
    })
    .then(foundRefreshToken => validate.generateToken(foundRefreshToken))
    .then(token => done(null, token, null, expiresIn))
    .catch(() => done(null, false));
}));

/**
 * Token endpoint
 *
 * `token` middleware handles client requests to exchange authorization grants
 * for access tokens.  Based on the grant type being exchanged, the above
 * exchange middleware will be invoked to handle the request.  Clients must
 * authenticate when making requests to this endpoint.
 */
exports.token = [
  passport.authenticate(['basic'], { session: false }),
  server.token(),
  server.errorHandler(),
];
