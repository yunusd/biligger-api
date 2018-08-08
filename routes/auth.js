const express = require('express');

const router = express.Router();

const oauth2 = require('../auth/oauth2');

router.post('/token', oauth2.token);

module.exports = router;
