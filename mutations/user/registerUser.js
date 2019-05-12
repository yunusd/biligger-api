const Joi = require('joi');
const { UserInputError } = require('apollo-server-express');
const { User, Invite } = require('../../models');
const { signUpValidation } = require('../../validation');

module.exports = async (_, args) => {
  if (args.bio === '') delete args.bio;
  await Joi.validate(args, signUpValidation, { abortEarly: false });

  const invitationCode = await Invite.findOne({ code: args.invitationCode, used: false });
  if (!invitationCode) {
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
    await Invite.findOneAndUpdate({ code: args.invitationCode }, {
      used: true,
    });
  }

  return savedUser;
};
