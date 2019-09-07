const express = require('express');
require('express-async-errors');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const redis = require('redis');

// Helpers
const removeConfirmations = require('./helpers/removeConfirmations');

// Custom Config
const config = require('./config');
const logger = require('./config/winston');

// Router require
const authRouter = require('./routes/auth');

// HRBAC
const rbac = require('./auth/hrbac');

// Middlewares
const rateLimiterRedisMiddleware = require('./middlewares/rateLimiterRedis');

logger.info('Using RedisStore for the session');
const redisClient = redis.createClient(config.redis.url);

// Express Config
const app = express();

// Cors Setting
app.use(cors(config.corsOptions));

// Rate Limiting
app.use(rateLimiterRedisMiddleware);

rbac.init();

app.use(async (req, res, next) => {
  req.scope = rbac;
  next();
});
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream })); // Logger stream from winston

// Session Config
app.use(session({
  saveUninitialized: true,
  resave: true,
  proxy: true,
  secret: config.session.secret,
  store: new RedisStore({
    client: redisClient,
  }),
  key: 'authorization.sid',
  cookie: {
    maxAge: config.session.maxAge,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./auth/auth');

app.use('/auth', authRouter);

// Authenticate user
app.use('/api', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (user) {
      req.login(user, error => ((error) ? next(error) : null));
    }
    return next();
  })(req, res, next);
});

// Remove expired confirmations from db in every 25 hours.
setInterval(async () => {
  try {
    await removeConfirmations();
  } catch (error) {
    logger.error(error.stack, 'Can\'t remove expired confirmations from db');
  }
}, 3600 * 25);

// Catch all for error messages.
app.use((err, req, res, next) => {
  if (err) {
    if (err.status == null) {
      logger.error(err.stack, 'Internal unexpected error from');
      res.status(500);
      res.json({
        message: err.message,
        type: err.code,
        stack: err.stack,
      });
    } else {
      res.status(err.status);
      res.json({
        message: err.message,
        type: err.code,
        stack: err.stack,
      });
    }
  } else {
    next();
  }
});

module.exports = app;
