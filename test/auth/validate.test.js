
require('process').env.OAUTHRECIPES_SURPRESS_TRACE = true;

const mongoose = require('mongoose');
const { User, Client } = require('../../models');
const validate = require('../../auth/validate');
const utils = require('../../auth/utils');

describe('validate', () => {
  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  let savedClient = {};
  let savedUser = {};

  beforeEach(async (done) => {
    await Client.remove({});
    await User.remove({});
    savedClient = await Client.create({
      name: 'mobile',
      clientId: '1',
      clientSecret: 'ssh-secret',
      trustedClient: true,
    });
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
    await Client.remove({});
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

  describe('#client', () => {
    afterEach(() => Client.remove({}));
    test('show throw if client is undefined', () => {
      expect(() => validate.client(undefined, 'pass')).toThrow('Client does not exist');
    });

    test('show throw if client is null', () => {
      expect(() => validate.client(null, 'pass')).toThrow('Client does not exist');
    });

    test('show throw if client secret does not match', () => {
      const mockError = new Error('Client secret does not matches');
      return expect(validate.client(savedClient, 'ssh-pass')).rejects.toEqual(mockError);
    });

    test('show return client if client secret matches', () => expect(validate.client(savedClient, 'ssh-secret'))
      .resolves.toHaveProperty('name', 'mobile'));
  });

  describe('#clientExists', () => {
    test('show throw if client is undefined', () => {
      expect(() => validate.clientExists(undefined)).toThrow('Client does not exist');
    });

    test('show throw if client is null', () => {
      expect(() => validate.clientExists(null)).toThrow('Client does not exist');
    });

    test('show return user if it exists', () => {
      expect(validate.clientExists({ clientSecret: 'password' }))
        .toEqual({ clientSecret: 'password' });
    });
  });

  describe('#token', () => {
    test('should throw with undefined code', () => {
      expect(() => validate.token({ userID: '1' }, undefined))
        .toThrow({ name: 'JsonWebTokenError', message: 'jwt must be provided' });
    });

    test('should throw with null code', () => {
      expect(() => validate.token({ userID: '1' }, null))
        .toThrow({ name: 'JsonWebTokenError', message: 'jwt must be provided' });
    });

    test('should throw with invalid userID', () => {
      const token = utils.createToken();
      return validate.token({ userID: '000000000000000000000000' }, token)
        .catch(err => expect(err.message).toEqual('User does not exist'));
    });

    test('should throw with invalid clientID', () => {
      const token = utils.createToken();
      return validate.token({ clientID: '000000000000000000000000' }, token)
        .catch(err => expect(err.message).toEqual('Client does not exist'));
    });

    test('should throw with invalid userID and invalid clientID', () => {
      const token = utils.createToken();
      return validate.token({ userID: '000000000000000000000000', clientID: '000000000000000000000000' }, token)
        .catch(err => expect(err.message).toEqual('User does not exist'));
    });

    test('should return user with valid user', () => {
      const token = utils.createToken();
      const user = { userID: savedUser.id };
      return validate.token(user, token)
        .then(returnedUser => expect(returnedUser.id).toEqual(user.userID));
    });

    test('should return client with valid client', () => {
      const token = utils.createToken();
      const client = { clientID: savedClient.clientId };
      return validate.token(client, token)
        .then(returnedClient => expect(returnedClient.clientId).toEqual(client.clientID));
    });
  });

  describe('#refreshToken', () => {
    test('should throw with undefined code', () => {
      expect(() => validate.refreshToken({
        clientID: '1',
      }, undefined, {
        id: '1',
      })).toThrow({ name: 'JsonWebTokenError', message: 'jwt must be provided' });
    });

    test('should throw with null code', () => {
      expect(() => validate.refreshToken({
        clientID: '1',
      }, null, {
        id: '1',
      })).toThrow({ name: 'JsonWebTokenError', message: 'jwt must be provided' });
    });

    test('should throw with invalid client ID', () => {
      const token = utils.createToken();
      expect(() => validate.refreshToken({
        clientID: '1',
      }, token, {
        id: '2',
      })).toThrow('RefreshToken clientID does not match client id given');
    });

    test('should return refreshToken with everything valid', () => {
      const token = utils.createToken();
      expect(validate.refreshToken({ clientID: '1' }, token, { clientId: '1' })).toHaveProperty('clientID', '1');
    });
  });

  describe('#isRefreshToken', () => {
    test('show return true for scope having offline_access', () => {
      expect(validate.isRefreshToken({ scope: 'offline_access' })).toEqual(true);
    });

    test('show return false for scope of other value', () => {
      expect(validate.isRefreshToken({ scope: '*' })).toEqual(false);
    });

    test('show return false for non existent scope', () => {
      expect(validate.isRefreshToken({ })).toEqual(false);
    });
  });

  describe('#generateRefreshToken', () => {
    test('should generate and return a refresh token', () => validate.generateRefreshToken({ userID: '1', clientID: '1', scope: '*' })
      .then(token => utils.verifyToken(token)));
  });

  describe('#generateToken', () => {
    test('should generate and return a token', () => validate.generateToken({ userID: '1', clientID: '1', scope: '*' })
      .then(token => utils.verifyToken(token)));
  });

  describe('#generateTokens', () => {
    test('should generate and return an access and refresh token', () => validate.generateTokens({ userID: '1', clientID: '1', scope: 'offline_access' })
      .then(([accessToken, refreshToken]) => {
        utils.verifyToken(accessToken);
        utils.verifyToken(refreshToken);
      }));

    test('should generate and return an access with no refresh token when scope is defined as all', () => validate.generateTokens({ userID: '1', clientID: '1', scope: '*' })
      .then(([accessToken, refreshToken]) => {
        utils.verifyToken(accessToken);
        expect(refreshToken).toBeUndefined();
      }));
  });

  describe('#tokenForHttp', async () => {
    test('should return 400 status', () => validate.tokenForHttp().catch(err => expect(err.status).toEqual(400)));

    test('should reject undefined token', () => validate.tokenForHttp().catch(err => expect(err.message).toEqual('invalid_token')));

    test('should reject null token', () => validate.tokenForHttp(null).catch(err => expect(err.message).toEqual('invalid_token')));

    test('should reject invalid token', () => validate.tokenForHttp('abc').catch(err => expect(err.message).toEqual('invalid_token')));

    test('should work with a valid token', () => {
      const token = utils.createToken();
      return validate.tokenForHttp(token)
        .then(returnedToken => expect(returnedToken).toEqual(token));
    });
  });

  describe('#clientExistsForHttp', () => {
    test('should return 400 status', () => {
      try {
        validate.clientExistsForHttp();
      } catch (err) {
        expect(err.status).toEqual(400);
      }
    });

    test('should reject undefined client', () => {
      expect(() => validate.clientExistsForHttp()).toThrow('invalid_token');
    });

    test('should reject null client`', () => {
      expect(() => validate.clientExistsForHttp(null)).toThrow('invalid_token');
    });

    test('should return a non null client', () => {
      const client = validate.clientExistsForHttp({ client: 123 });
      expect(client).toEqual({ client: 123 });
    });
  });
});
