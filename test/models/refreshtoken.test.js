const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../../models');
const utils = require('../../auth/utils');

describe('RefreshToken', () => {
  beforeEach(() => RefreshToken.removeAll());

  describe('#find', () => {
    test('should return empty refresh tokens with invalid token request', () => RefreshToken.find('abc')
      .then(token => expect(token).toBeUndefined()));

    test('should return empty refresh tokens with null', () => RefreshToken.find(null)
      .then(token => expect(token).toBeUndefined()));

    test('should return empty refresh tokens with undefined', () => RefreshToken.find(undefined)
      .then(token => expect(token).toBeUndefined()));

    test('should find a token saved', () => {
      const token = utils.createToken();
      return RefreshToken.save(token, '1', '1', '*')
        .then(() => RefreshToken.find(token))
        .then(foundToken => expect(foundToken).toEqual({
          clientID: '1',
          userID: '1',
          scope: '*',
        }));
    });
  });

  describe('#save', () => {
    test('should save an refresh token correctly and return that token', () => {
      const token = utils.createToken();
      return RefreshToken.save(token, '1', '1', '*')
        .then(saved => expect(saved).toEqual({
          clientID: '1',
          userID: '1',
          scope: '*',
        }))
        .then(() => RefreshToken.find(token))
        .then(foundToken => expect(foundToken).toEqual({
          clientID: '1',
          userID: '1',
          scope: '*',
        }));
    });
  });

  describe('#delete', () => {
    test('should return empty refresh tokens with invalid token request', () => RefreshToken.delete('abc')
      .then(token => expect(token).toBeUndefined()));

    test('should return empty refresh tokens with null', () => RefreshToken.delete(null)
      .then(token => expect(token).toBeUndefined()));

    test('should return empty refresh tokens with undefined', () => RefreshToken.delete(undefined)
      .then(token => expect(token).toBeUndefined()));

    test('should delete an refresh token and return it', () => {
      const token = utils.createToken();
      return RefreshToken.save(token, '1', '1', '*')
        .then(() => RefreshToken.delete(token))
        .then(deletedToken => expect(deletedToken).toEqual({
          clientID: '1',
          userID: '1',
          scope: '*',
        }))
        .then(() => RefreshToken.find(token))
        .then(foundToken => expect(foundToken).toEqual(undefined));
    });
  });

  describe('#removeAll', () => {
    test('should remove all tokens', () => {
      const token1 = utils.createToken();
      const token2 = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return RefreshToken.save(token1, '1', '1', '*')
        .then(() => RefreshToken.save(token2, '2', '2', '*'))
        .then(() => RefreshToken.removeAll())
        .then((expiredTokens) => {
          expect(expiredTokens[tokenId1]).toEqual({
            clientID: '1',
            userID: '1',
            scope: '*',
          });
          expect(expiredTokens[tokenId2]).toEqual({
            clientID: '2',
            userID: '2',
            scope: '*',
          });
        })
        .then(() => RefreshToken.find(token1))
        .then(foundToken => expect(foundToken).toEqual(undefined))
        .then(() => RefreshToken.find(token2))
        .then(foundToken => expect(foundToken).toEqual(undefined));
    });
  });
});
