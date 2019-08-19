const Joi = require('joi');
const { UserInputError } = require('apollo-server-express');
const { User, Invite } = require('../../models');
const { signUpValidation } = require('../../validation');
const { createHash, sendEmail } = require('../../auth/utils');

const {
  NODE_ENV,
} = process.env;

module.exports = async (_, args) => {
  // Removing bio field if is empty.
  if (args.bio === '') delete args.bio;

  // Removing spaces from username field.
  args.username = args.username.replace(/ /g, '');

  await Joi.validate(args, signUpValidation, { abortEarly: false });

  const invitationCode = await Invite.findOne({ code: args.invitationCode, used: false });
  if (!invitationCode && NODE_ENV !== 'development') {
    throw new UserInputError('Davetiye kodu geçersiz!', {
      invalidArg: {
        name: 'invitationCode',
        value: args.invitationCode,
      },
    });
  }

  // Deleting passwordCheck field because mongoose schema doesn't have this field.
  delete args.passwordCheck;
  const user = new User(args);
  const savedUser = await user.save();
  if (savedUser) {
    const { hash } = await createHash({ userId: savedUser.id, action: 1 });
    await sendEmail(1, { hash, user: savedUser });
    await Invite.findOneAndUpdate({ code: args.invitationCode }, {
      used: true,
    });
  }

  return savedUser;
};
