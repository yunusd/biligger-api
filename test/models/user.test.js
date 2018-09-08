const mongoose = require('mongoose');

const { User } = require('../../models');

describe('users', () => {
  let savedUser = {};

  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }));

  beforeEach(async (done) => {
    await User.remove({});
    savedUser = await User.create({
      username: 'bob',
      password: 'secret',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });
    done();
  });

  afterEach(() => User.remove({}));

  test('should not find an invalid user', async () => {
    const user = await User.findById('000000000000000000000000');
    expect(user).toBeNull();
  });

  test('should find a user by id', async () => {
    const user = await User.findById(savedUser.id);
    expect(user).toHaveProperty('username', 'bob');
    expect(user).toHaveProperty('email', 'email@email.com');
    expect(user).toHaveProperty('roles', 'user');
    expect(user).toHaveProperty('degree', 'soft');
  });

  test('should find a user by username', async () => {
    const user = await User.findOne({ username: savedUser.username });
    expect(user).toHaveProperty('username', 'bob');
    expect(user).toHaveProperty('email', 'email@email.com');
    expect(user).toHaveProperty('roles', 'user');
    expect(user).toHaveProperty('degree', 'soft');
  });
});
