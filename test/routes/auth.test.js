const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const { User } = require('../../models');

describe('Auth', () => {
  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  beforeEach(() => {
    const user = new User({
      username: 'bob',
      password: 'secret',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });

    const savedUser = user.save();

    return Promise.all([
      User.remove({}),
      savedUser,
    ]);
  });

  afterEach(async (done) => {
    await User.remove({});
    done();
  });

  afterAll(() => mongoose.disconnect());

  test('should return 401 status if auth fail, POST /auth', () => request(app)
    .post('/auth')
    .type('application/json')
    .send({
      username: 'bob',
      password: 'wrongSecret',
    })
    .expect(401));
});
