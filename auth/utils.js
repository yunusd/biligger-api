/* eslint-disable no-nested-ternary */

const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const Joi = require('joi');
const { Confirmation, User } = require('../models');
const { editUserPassword } = require('../validation');
const logger = require('../config/winston');
const encrypt = require('../helpers/encrypt');

/**
 * Creates a signed JSON WebToken and returns it.  Utilizes the private certificate to create
 * the signed JWT.  For more options and other things you can change this to, please see:
 * https://github.com/auth0/node-jsonwebtoken
 *
 * @param  {Number} exp - The number of seconds for this token to expire.  By default it will be 60
 *                        minutes (3600 seconds) if nothing is passed in.
 * @param  {String} sub - The subject or identity of the token.
 * @return {String} The JWT Token
 */

const emailTemplate = (action, data) => {
  const actionOneUrl = 'https://biligger.com/confirmation_verify_email&';
  const actionTwoUrl = 'https://biligger.com/confirmation_reset_password&';

  const welcome = {
    to: `${data.user.email}`,
    from: 'test@example.com',
    subject: 'Hoşgeldiniz|| Biligger',
    text: 'Hoşgeldiniz',
    html: `
    <strong>Merhaba ${data.user.username},
    <br/> Biligger'a hoşgeldiniz :)
    </strong>`,
  };

  if (action === 1 || action === 2) {
    const { hash, user } = data;

    const verify = {
      to: `${user.email}`,
      from: 'test@example.com',
      templateId: 'd-371c9a4b3e46495f879529ffad574255',
      dynamic_template_data: {
        username: user.username,
        confirmationUrl: `${actionOneUrl}${hash}`,
      },
    };

    const resetPassword = {
      to: `${user.email}`,
      from: 'test@example.com',
      templateId: 'd-149e92dd468b4112b0f120f0fc2eab19',
      dynamic_template_data: {
        username: user.username,
        confirmationUrl: `${actionTwoUrl}${hash}`,
      },
    };

    return action === 1 ? verify : action === 2 ? resetPassword : null;
  }

  return welcome;
};

module.exports.activateUser = userId => User.findByIdAndUpdate(userId, { active: true });

module.exports.resetPassword = async ({ userId, newPassword, newPasswordCheck }) => {
  await Joi.validate({ newPassword, newPasswordCheck }, editUserPassword, { abortEarly: false });

  // Encryption proccess is handled by module.
  // Because mongoose doesn't support update virtual fields.
  // TODO: Implement update virtual fields when mongoose support.
  // const pass = await encrypt(password);
  const pass = await encrypt(newPassword);

  return User.findByIdAndUpdate(userId, pass);
};

// 1000 miliseconds * 3600 = 1 hour
module.exports.createHash = async ({ userId, action, expire = 1000 * 3600 * 24 }) => {
  const hash = crypto.randomBytes(20).toString('hex');
  return Confirmation.create({
    userId,
    hash,
    action,
    // 15 minutes to expire if action is equal to "2"(reset password)
    expire: action !== 2 ? Date.now() + expire : Date.now() + (1000 * 60 * 15),
  });
};

module.exports.verifyHash = async ({ hash, action }) => {
  const dbHash = action !== 2
    ? await Confirmation.findOneAndRemove({ hash, action })
    : await Confirmation.findOne({ hash, action });

  const response = {
    userId: dbHash ? dbHash.userId : null,
    hash: !!dbHash,
    expired: dbHash ? dbHash.expire < Date.now() : null,
  };

  return response;
};

module.exports.sendEmail = async (action, data) => {
  sgMail.setApiKey('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');

  const msg = emailTemplate(action, data);

  try {
    sgMail.send(msg);
  } catch (error) {
    return logger(error);
  }
};
