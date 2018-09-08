const jwt = require('jsonwebtoken');
const { AccessToken } = require('../../models');
const utils = require('../../auth/utils');

describe('accesstokens', () => {
  beforeEach(() => AccessToken.removeAll());

  describe('#find', () => {
    test('should return empty access tokens with invalid token request', () => AccessToken.find('abc')
      .then(token => expect(token).toBeUndefined()));

    test('should return empty access tokens with null', () => AccessToken.find(null)
      .then(token => expect(token).toBeUndefined()));

    test('should return empty access tokens with undefined', () => AccessToken.find(undefined)
      .then(token => expect(token).toBeUndefined()));

    test('should find a token saved', () => {
      const token = utils.createToken();
      return AccessToken.save(token, new Date(0), '1', '1', '*')
        .then(() => AccessToken.find(token))
        .then(foundToken => expect(foundToken).toEqual({
          clientID: '1',
          expirationDate: new Date(0),
          userID: '1',
          scope: '*',
        }));
    });
  });

  describe('#save', () => {
    test('should save an access token correctly and return that token', () => {
      const token = utils.createToken();
      return AccessToken.save(token, new Date(0), '1', '1', '*')
        .then(saved => expect(saved).toEqual({
          clientID: '1',
          expirationDate: new Date(0),
          userID: '1',
          scope: '*',
        }))
        .then(() => AccessToken.find(token))
        .then(foundToken => expect(foundToken).toEqual({
          clientID: '1',
          expirationDate: new Date(0),
          userID: '1',
          scope: '*',
        }));
    });
  });

  describe('#delete', () => {
    test('should return empty access tokens with invalid token request', () => AccessToken.delete('abc')
      .then(token => expect(token).toBeUndefined()));

    test('should return empty access tokens with null', () => AccessToken.delete(null)
      .then(token => expect(token).toBeUndefined()));

    test('should return empty access tokens with undefined', () => AccessToken.delete(undefined)
      .then(token => expect(token).toBeUndefined()));

    test('should delete an access token and return it', () => {
      const token = utils.createToken();
      return AccessToken.save(token, new Date(0), '1', '1', '*')
        .then(() => AccessToken.delete(token))
        .then(deletedToken => expect(deletedToken).toEqual({
          clientID: '1',
          expirationDate: new Date(0),
          userID: '1',
          scope: '*',
        }))
        .then(() => AccessToken.find(token))
        .then(foundToken => expect(foundToken).toEqual(undefined));
    });
  });

  describe('#removeExpired', () => {
    test('should remove expired tokens', () => {
      const token1 = utils.createToken();
      const token2 = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return AccessToken.save(token1, new Date(0), '1', '1', '*')
        .then(() => AccessToken.save(token2, new Date(0), '2', '2', '*'))
        .then(() => AccessToken.removeExpired())
        .then((expiredTokens) => {
          expect(expiredTokens[tokenId1]).toEqual({
            clientID: '1',
            expirationDate: new Date(0),
            userID: '1',
            scope: '*',
          });
          expect(expiredTokens[tokenId2]).toEqual({
            clientID: '2',
            expirationDate: new Date(0),
            userID: '2',
            scope: '*',
          });
        })
        .then(() => AccessToken.find(token1))
        .then(foundToken => expect(foundToken).toEqual(undefined))
        .then(() => AccessToken.find(token2))
        .then(foundToken => expect(foundToken).toEqual(undefined));
    });
  });

  describe('#removeAll', () => {
    test('should remove all tokens', () => {
      const token1 = utils.createToken();
      const token2 = utils.createToken();
      const tokenId1 = jwt.decode(token1).jti;
      const tokenId2 = jwt.decode(token2).jti;
      return AccessToken.save(token1, new Date(0), '1', '1', '*')
        .then(() => AccessToken.save(token2, new Date(0), '2', '2', '*'))
        .then(() => AccessToken.removeAll())
        .then((expiredTokens) => {
          expect(expiredTokens[tokenId1]).toEqual({
            clientID: '1',
            expirationDate: new Date(0),
            userID: '1',
            scope: '*',
          });
          expect(expiredTokens[tokenId2]).toEqual({
            clientID: '2',
            expirationDate: new Date(0),
            userID: '2',
            scope: '*',
          });
        })
        .then(() => AccessToken.find(token1))
        .then(foundToken => expect(foundToken).toEqual(undefined))
        .then(() => AccessToken.find(token2))
        .then(foundToken => expect(foundToken).toEqual(undefined));
    });
  });
});
