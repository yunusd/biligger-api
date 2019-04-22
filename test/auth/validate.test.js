require('process').env.OAUTHRECIPES_SURPRESS_TRACE = true;

const mongoose = require('mongoose');
const { User } = require('../../models');
const validate = require('../../auth/validate');

describe('validate', () => {
  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  let savedUser = {};

  beforeEach(async (done) => {
    await User.remove({});
    savedUser = await User.create({
      username: 'bobs',
      password: 'secret',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });
    done();
  });

  afterEach(async (done) => {
    await User.remove({});
    done();
  });

  describe('#logAndThrow', () => {
    test('should throw a given mesage', () => {
      expect(() => validate.logAndThrow('some message')).toThrow('some message');
    });
  });

  describe('#user', () => {
    test('show throw if user is undefined', () => {
      expect(() => validate.user(undefined, 'pass')).toThrow('User does not exist');
    });

    test('show throw if user is null', () => {
      expect(() => validate.user(null, 'pass')).toThrow('User does not exist');
    });

    test('show throw if password does not match', () => {
      const mockError = new Error('User password does not match');
      return expect(validate.user(savedUser, 'password')).rejects.toEqual(mockError);
    });

    test('show return user if password matches', () => expect(validate.user(savedUser, 'secret'))
      .resolves.toHaveProperty('username', 'bobs'));
  });

  describe('#userExists', () => {
    test('show throw if user is undefined', () => {
      expect(() => validate.userExists(undefined)).toThrow('User does not exist');
    });

    test('show throw if user is null', () => {
      expect(() => validate.userExists(null)).toThrow('User does not exist');
    });

    test('show return user if it exists', () => {
      expect(validate.userExists({ password: 'password' }))
        .toEqual({ password: 'password' });
    });
  });
});
