const express = require('express');
const passport = require('passport');
const scope = require('../middlewares/scope');

const router = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), scope('user'), (req, res) => {
  res.json({
    user_id: req.user.username,
    email: req.user.email,
    degree: req.user.degree,
    bio: req.user.bio,
    scope: req.authInfo.scope,
  });
});


module.exports = router;
