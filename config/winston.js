const path = require('path');
const winston = require('winston');

const { createLogger, format, transports } = winston;


const dir = `${path.dirname(__dirname)}/logs`;

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ level: true, message: true }),
        format.simple(),
      ),
    }),
    new transports.File({
      level: 'info',
      filename: `${dir}/combined.log`,
    }),
    new transports.File({
      level: 'error',
      filename: `${dir}/error.log`,
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${dir}/exceptions.log` }),
  ],
  exitOnError: false,
});

logger.stream = {
  write(message) {
    logger.info(message.slice(0, -1));
  },
};

module.exports = logger;
