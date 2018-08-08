const logger = require('../config/winston');

const winston = true;

module.exports = scope => (req, res, next) => {
  if (!scope) {
    if (!winston) {
      throw Error;
    }
    logger.error('Scopes middleware needs argument');
    res.status(500).send('Internal Error');
  } else {
    if (!req.authInfo.scope) return res.status(400).send('Bad Request');
    if (req.authInfo.scope !== scope) return res.status(401).send('Restricted');
    next();
  }
};
