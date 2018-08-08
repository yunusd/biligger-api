const express = require('express');
const { check, validationResult, body } = require('express-validator/check');

const { User } = require('../models');

const router = express.Router();

const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].{7,}$/;

const weakPass = [
  '1234567',
  '123456789',
  '987654321',
  '7654321',
  '3456789',
  'password',
  'şifre',
  'sifre',
];

router.post('/register', [
  check('username')
    .exists()
    .isLength(2),
  body('username')
    .custom(value => User.findOne({ username: value }).exec()
      .then((user) => {
        if (user) {
          return Promise.reject('Kullanıcı adı zaten var.');
        }
      })),
  check('password', 'Şifre en az 7 karakter uzunluğunda ve en az 1 tane küçük harf, büyük harf ve sayıdan oluşmalı.')
    .exists()
    .not().isIn(weakPass)
    .withMessage('Şifrenizde tahmin edilebilir kelimeler kullanmayın.')
    .matches(regexp),
  check('email', 'Geçerli bir email adresi girin')
    .isEmail()
    .normalizeEmail(),
  body('email')
    .custom(value => User.findOne({ email: value }).exec()
      .then((user) => {
        if (user) {
          return Promise.reject('E-posta zaten var.');
        }
      }))
    .normalizeEmail(),
  check('degree', 'En az 10 karakter olmalı')
    .isLength({ min: 4 }),
  check('bio', 'En az 50 karakter olmalı')
    .optional(true)
    .isLength({ min: 50 }),
], async (req, res) => {
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

router.get('/users', async (req, res) => {
  const user = await User.find({}).select('username email degree bio -_id').exec();
  return res.send({ user });
});

module.exports = router;
