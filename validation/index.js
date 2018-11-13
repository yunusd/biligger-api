const Joi = require('joi');

module.exports.signUpValidation = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(20)
    .required(),
  // TODO: Password needs to match this
  // ^(.{0,7}|[^0-9]*|[^\\p{Ll}]*|[^\\p{Lu}]*|[\\p{Ll}\\p{Lu}0-9]*)$ with non-english support
  password: Joi.string().min(4).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  degree: Joi.string().min(3).max(30),
  bio: Joi.string().min(30).max(300),
});
