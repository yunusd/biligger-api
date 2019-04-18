const express = require('express');
const passport = require('passport');
const scope = require('../middlewares/scope');

const router = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), scope('user'), (req, res) => {
  res.json({
    user_id: req.user.id,
  });
});


module.exports = router;
