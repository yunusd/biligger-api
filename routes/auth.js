const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/', passport.authenticate('local'), (req, res) => {
  res.json({
    status: 'success',
  });
});

module.exports = router;
