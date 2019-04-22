const config = require('../../config');

describe('config', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should have session maxAge as a number', () => {
    expect(typeof config.session.maxAge).toBe('number');
  });

  it('should have session secret as a string', () => {
    expect(typeof config.session.secret).toBe('string');
  });
});
