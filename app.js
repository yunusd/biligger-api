const express = require('express');
require('express-async-errors');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const morgan = require('morgan');

// Custom Config
const config = require('./config');
const logger = require('./config/winston');

// Router require
const authRouter = require('./routes/auth');

// HRBAC
const rbac = require('./auth/hrbac');

logger.info('Using MemoryStore for the session');
const { MemoryStore } = expressSession;

// Express Config
const app = express();

rbac.init();

app.use(async (req, res, next) => {
  req.scope = rbac;
  next();
});
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream })); // Logger stream from winston

// Session Config
app.use(expressSession({
  saveUninitialized: true,
  resave: true,
  secret: config.session.secret,
  store: new MemoryStore(),
  key: 'authorization.sid',
  cookie: {
    maxAge: 3600000 * 24 * 7 * 52,
    secure: true,
    httpOnly: true,
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./auth/auth');

app.use('/oauth', authRouter);

// Authenticate user
app.use('/api', (req, res, next) => {
  passport.authenticate('bearer', { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.login(user, error => ((error) ? next(error) : null));
    }
    return next();
  })(req, res, next);
});

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
