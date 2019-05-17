const XRegExp = require('xregexp');

const {
  NODE_ENV,

  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,

  SESSION_SECRET,
  REDIS_URL,
} = process.env;

//
// The configuration options of the server
//

/**
 * Mongoose Connection URL
 */

exports.db = {
  url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
  options: {
    useNewUrlParser: true,
  },
};

/**
 * Redis Connection URL
 */

exports.redis = {
  url: REDIS_URL,
};

/**
 * Session configuration
 *
 * maxAge - The maximum age in milliseconds of the session.  Use null for web browser session only.
 *          Use something else large like 3600000 * 24 * 7 * 52 for a year.
 * secret - The session secret that you should change to what you want
 */
exports.session = {
  maxAge: 3600000 * 24 * 7 * 52,
  secret: SESSION_SECRET,
};


/**
 * Validate inputs for to be desired input.
 * weekPass - The password which is too week to be a password.
 * regexp - Desired password pattern.
 */

exports.passwordMatch = {
  regex: /^(?=(.*[a-zA-Z].*){3,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,}$/,
  regexpDep: XRegExp('^(.{0,7}|[^0-9]*|[^\\p{Ll}]*|[^\\p{Lu}]*|[\\p{Ll}\\p{Lu}0-9]*)$'),
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
  origin: NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://localhost',
  credentials: true,
};
