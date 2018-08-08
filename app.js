require('express-async-errors');
const mongoose = require('mongoose');
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
const path = require('path');
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
      logger.error(err.stack, 'Internal unexpected error from' );
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

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:pass@localhost:27017/biligger', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', logger.error.bind(logger, 'Connection error: '));
db.once('open', () => {
  logger.info('Database connection is estableshed');
});

const port = process.env.PORT || '3000';

const options = {
  key: fs.readFileSync(path.join(__dirname, '/certs/privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/certs/certificate.pem')),
};
https.createServer(options, app).listen(port);
logger.info(`API is running on ${port}`);
