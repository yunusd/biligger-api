const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const { User, Client } = require('../../models');

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
    const client = new Client({
      name: 'mobile',
      clientId: 'abc123',
      clientSecret: 'ssh-secret',
      trustedClient: true,
    });
    const savedClient = client.save();
    const savedUser = user.save();

    return Promise.all([
      User.remove({}),
      Client.remove({}),
      savedUser,
      savedClient,
    ]);
  });

  afterEach(async (done) => {
    await User.remove({});
    await Client.remove({});
    done();
  });

  afterAll(() => mongoose.disconnect());

  // test('should return 401 status if auth fail, GET /api', () => request(app)
  //   .get('/api')
  //   .type('application/json')
  //   .expect(401));

  test('return refreshtoken and accesstoken if everyting is valid, POST /oauth/token', () => request(app)
    .post('/oauth/token')
    .auth('abc123', 'ssh-secret')
    .set('Content-Type', 'application/json')
    .send(`{
        "grant_type": "password",
        "username": "bob",
        "password": "secret",
        "scope": "offline_access"
      }`)
    .expect(200)
    .then((res) => {
      expect(res.text).toContain('refresh_token');
      expect(res.text).toContain('access_token');
    }));

  test('return accesstoken if everyting is valid, POST /oauth/token', () => request(app)
    .post('/oauth/token')
    .auth('abc123', 'ssh-secret')
    .set('Content-Type', 'application/json')
    .send(`{
        "grant_type": "password",
        "username": "bob",
        "password": "secret",
        "scope": "*"
      }`)
    .expect(200)
    .then((res) => {
      expect(res.text).toContain('access_token');
    }));
});
