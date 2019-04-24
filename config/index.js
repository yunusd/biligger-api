const XRegExp = require('xregexp');
//
// The configuration options of the server
//

/**
 * Session configuration
 *
 * maxAge - The maximum age in milliseconds of the session.  Use null for web browser session only.
 *          Use something else large like 3600000 * 24 * 7 * 52 for a year.
 * secret - The session secret that you should change to what you want
 */
exports.session = {
  maxAge: 3600000 * 24 * 7 * 52,
  secret: 'Nothing but secret', // TODO: Change this secret and storage secure
};


/**
 * Validate inputs for to be desired input.
 * weekPass - The password which is too week to be a password.
 * regexp - Desired password pattern.
 */

exports.passwordMatch = {
  regexp: XRegExp('^(.{0,7}|[^0-9]*|[^\\p{Ll}]*|[^\\p{Lu}]*|[\\p{Ll}\\p{Lu}0-9]*)$'),
  weekPass: [
    '1234567',
    '123456789',
    '987654321',
    '7654321',
    '3456789',
    'password',
    'şifre',
    'sifre',
  ],
};

/**
 * Cors configuration
 * get options() - It is a getter contains cors options.
 */

// exports.cors = {
//   get options() {
//     const whitelist = ['https://localhost:3000', 'http://localhost:3001'];
//     return {
//       origin(origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//       credentials: true,
//     };
//   },
// };

exports.corsOptions = {
  origin: 'https://localhost:3001',
  credentials: true,
};
