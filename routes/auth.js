const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', passport.authenticate('local'), (req, res) => {
  res.json({
    status: 'success',
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({
    message: 'success',
  });
});

module.exports = router;
