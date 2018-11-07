const { check, body } = require('express-validator/check');

const { User, Post } = require('../models');
const { passwordMatch } = require('../config');

module.exports.validateRegister = [
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
  check('password', 'Şifre en az 7 karakter uzunluğunda ve en az 1 tane küçük harf, büyük harf, sayı ve özel karakterden oluşmalı.')
    .exists()
    .custom(value => !/\s/.test(value)).withMessage('No Space') // Space is not allowed in password.
    .not().isIn(passwordMatch.weakPass)
    .withMessage('Şifrenizde tahmin edilebilir kelimeler kullanmayın.')
    .custom((value) => {
      // regexp method is looking for invalid password. If it's match it's returning true.
      // We change this to false for not to register user because of invalid password.
      // by default it's returning true
      const isMatch = passwordMatch.regexp.test(value);
      if (isMatch === true) return false;
      return true;
    }),
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
];

module.exports.validateUserEdit = [
  check('password', 'Şifre en az 7 karakter uzunluğunda ve en az 1 tane küçük harf, büyük harf, sayı ve özel karakterden oluşmalı.')
    .exists()
    .custom(value => !/\s/.test(value)).withMessage('No Space')
    .not().isIn(passwordMatch.weakPass)
    .withMessage('Şifrenizde tahmin edilebilir kelimeler kullanmayın.')
    .custom((value) => {
      const isMatch = passwordMatch.regexp.test(value);
      if (isMatch === true) return false;
      return true;
    }),
  check('email', 'Geçerli bir email adresi girin')
    .isEmail()
    .normalizeEmail(),
  check('degree', 'En az 10 karakter olmalı')
    .isLength({ min: 4 }),
  check('bio', 'En az 50 karakter olmalı')
    .optional(true)
    .isLength({ min: 50 }),
];

module.exports.validatePost = [
  check('title', 'Başlık en az 10 karakter olmalı')
    .exists()
    .isLength({ min: 10 }),
  check('url', 'Geçerli bir url giriniz')
    .exists()
    .isURL(),
];
