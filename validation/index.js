const Joi = require('joi');

module.exports.signUpValidation = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(20)
    .required(),
  // TODO: Password needs to match this
  // ^(.{0,7}|[^0-9]*|[^\\p{Ll}]*|[^\\p{Lu}]*|[\\p{Ll}\\p{Lu}0-9]*)$ with non-english support
  password: Joi.string().min(4).required(),
  passwordCheck: Joi.string().min(4).valid(Joi.ref('password')).required()
    .options({
      language: {
        any: {
          allowOnly: 'must match password',
        },
      },
    }),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  degree: Joi.string().min(3).max(30),
  bio: Joi.string().min(30).max(300),
});

module.exports.editUserPassword = Joi.object().keys({
  // TODO: Password needs to match this
  // ^(.{0,7}|[^0-9]*|[^\\p{Ll}]*|[^\\p{Lu}]*|[\\p{Ll}\\p{Lu}0-9]*)$ with non-english support
  newPassword: Joi.string().min(4).required(),
  newPasswordCheck: Joi.string().min(4).valid(Joi.ref('newPassword')).required()
    .options({
      language: {
        any: {
          allowOnly: 'must match password',
        },
      },
    }),
});

module.exports.editUserEmail = Joi.object()
  .keys({ email: Joi.string().email({ minDomainAtoms: 2 }).required() });

module.exports.editUserDegree = Joi.object().keys({
  degree: Joi.string().min(3).max(30),
});

module.exports.editUserBio = Joi.object().keys({
  bio: Joi.string().min(30).max(300),
});

module.exports.postValidation = Joi.object().keys({
  title: Joi.string().required(),
  content: Joi.string().required(),
  url: Joi.string().uri(),
  author: Joi.string().min(24).max(24),
  category: Joi.exist(),
});

module.exports.editPostValidation = Joi.object().keys({
  id: Joi.string().min(24).max(24),
  title: Joi.string().required(),
  content: Joi.string().required(),
  url: Joi.string().uri(),
  author: Joi.string().min(24).max(24),
  category: Joi.exist(),
});

module.exports.commentValidation = Joi.object().keys({
  id: Joi.string().min(24).max(24),
  content: Joi.string().required(),
  author: Joi.string().min(24).max(24),
  parent: Joi.string().required(),
  parentModel: Joi.string().required(),
});

module.exports.editCommentValidation = Joi.object().keys({
  id: Joi.string().min(24).max(24),
  content: Joi.string().required(),
  author: Joi.string().min(24).max(24),
});
