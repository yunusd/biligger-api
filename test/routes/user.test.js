const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const { User, Client } = require('../../models');
const validate = require('../../auth/validate');
const utils = require('../../auth/utils');

describe('User Register', () => {
  let token = '';

  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  beforeEach(() => {
    const user = new User({
      username: 'bob',
      password: 'Secret1*',
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

    validate.generateToken({ userID: user.id, clientID: 'abc123', scope: 'offline_access' }).then((createdToken) => {
      if (utils.verifyToken(createdToken)) {
        token = createdToken;
      }
    });

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

  test('should return 401 status if auth fail, GET /api', () => request(app)
    .get('/api')
    .expect(401));

  test('should register user if everyting is valid, POST /oauth/token', () => request(app)
    .post('/api/register')
    .set('Content-Type', 'application/json')
    .send({
      username: 'bobname',
      password: 'Secret1*',
      email: 'bob@email.com',
      roles: 'user',
      degree: 'soft',
    })
    .expect(200)
    .then((res) => {
      expect(res.text).toContain('success');
    }));

  test('PUT /api/user/edit', () => request(app)
    .put('/api/user/edit')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      password: 'Secret1*',
      email: 'email@email.com',
      degree: 'changed',
    })
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toHaveProperty('username', 'bob');
      expect(JSON.parse(res.text)).toHaveProperty('degree', 'changed');
    }));

  test('DELETE /api/user/delete', () => request(app)
    .delete('/api/user/delete')
    .set('Authorization', `Bearer ${token}`)
    .expect(410)
    .then(res => expect(JSON.parse(res.text)).toHaveProperty('success')));
});
