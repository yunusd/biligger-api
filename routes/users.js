const express = require('express');
const passport = require('passport');
const { validationResult } = require('express-validator/check');
const { validateRegister, validateUserEdit } = require('../middlewares/validate');

const { User } = require('../models');
const scope = require('../middlewares/scope');
const logger = require('../config/winston');

const encrypt = require('../helpers/encrypt');

const router = express.Router();

router.post('/register', validateRegister, async (req, res) => {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      degree: req.body.degree,
      bio: req.body.bio,
    });
    await user.save();
    return res.status(200).json({ success: 'Kayıt Başarılı' });
  }
});

router.put('/user/edit', validateUserEdit, passport.authenticate('bearer', { session: false }), scope('user'), async (req, res) => {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    // If registired email and given email doesn't equal will try to find that user
    // and if it finds, return error.
    if (req.body.email !== req.user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) return res.status(422).json({ errors: 'E-posta zaten var.' });
    }
    const query = { username: req.user.username };

    // Encryption proccess is handled by module.
    // Because mongoose doesn't support update virtual fields.
    // TODO: Implement update virtual fields when mongoose support.
    const pass = await encrypt(req.body.password);

    // Finding user with given query and
    // because of 'new:true' option return updated user.
    const user = await User.findOneAndUpdate(query, {
      salt: pass.salt,
      hashedPassword: pass.encryptedPassword,
      email: req.body.email,
      degree: req.body.degree,
      bio: req.body.bio,
    }, { new: true }).exec();

    if (!user) {
      logger.error('Kullanıcı bulunamadı');
      return res.status('401').json({ error: 'Kullanıcı bulunamadı' });
    }
    return res.send({
      username: user.username,
      email: user.email,
      degree: user.degree,
      bio: user.bio,
    });
  }
});

router.get('/users', async (req, res) => {
  const user = await User.find({}).select('username email degree bio -_id').exec();
  return res.send({ user });
});

router.delete('/user/delete', passport.authenticate('bearer', { session: false }), scope('user'), async (req, res) => {
  await User.deleteOne({ username: req.user.username });
  res.status(410).send({ success: 'Kullanıcı silindi' });
});

module.exports = router;
