require('express-async-errors');
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

// Custom Config
const config = require('./config');
const logger = require('./config/winston');

// Router require
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

logger.info('Using MemoryStore for the session');
const { MemoryStore } = expressSession;

// Express Config
const app = express();
app.use(helmet());
app.use(morgan('combined', { stream: logger.stream })); // Logger stream from winston
app.use(cookieParser());

// Session Config
app.use(expressSession({
  saveUninitialized: true,
  resave: true,
  secret: config.session.secret,
  store: new MemoryStore(),
  key: 'authorization.sid',
  cookie: {
    maxAge: 3600000 * 24 * 7 * 52,
    httpOnly: true,
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./auth/auth');
// Router
app.use('/api', indexRouter);
app.use('/oauth', authRouter);
app.use('/api', usersRouter);

// Catch all for error messages.
app.use((err, req, res, next) => {
  if (err) {
    if (err.status == null) {
      logger.error(err.stack, 'Internal unexpected error from');
      res.status(500);
      res.json(err);
    } else {
      res.status(err.status);
      res.json(err);
    }
  } else {
    next();
  }
});

module.exports = app;
