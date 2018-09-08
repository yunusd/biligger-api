const config = require('../../config');

describe('config', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should calculate expiration date correctly', () => {
    expect(config.token.calculateExpirationDate().valueOf() - Date.now()).toEqual(3600000);
  });

  it('should have expiresIn as a number', () => {
    expect(typeof config.token.expiresIn).toBe('number');
  });

  it('codeToken should have expiresIn as a number', () => {
    expect(typeof config.codeToken.expiresIn).toBe('number');
  });

  it('refreshToken should have expiresIn as a number', () => {
    expect(typeof config.refreshToken.expiresIn).toBe('number');
  });

  it('should have db timeToCheckExpiredTokens as a number', () => {
    expect(typeof config.db.timeToCheckExpiredTokens).toBe('number');
  });

  it('should have session maxAge as a number', () => {
    expect(typeof config.session.maxAge).toBe('number');
  });

  it('should have session secret as a string', () => {
    expect(typeof config.session.secret).toBe('string');
  });
});