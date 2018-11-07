const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const { Post, User, Client } = require('../../models');
const validate = require('../../auth/validate');
const utils = require('../../auth/utils');

describe('post', () => {
  let savedUser = {};
  let token = {};
  let savedPost = {};

  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  beforeEach(async (done) => {
    await Post.remove({});
    await Client.remove({});

    savedUser = await User.create({
      username: 'bob',
      password: 'secret',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });

    await Client.create({
      name: 'mobile',
      clientId: 'abc123',
      clientSecret: 'ssh-secret',
      trustedClient: true,
    });

    savedPost = await Post.create({
      title: 'Lorem',
      content: 'Ipsum',
      url: 'https://www.nytimes.com',
      author: savedUser.id,
    });

    validate.generateToken({ userID: savedUser.id, clientID: 'abc123', scope: 'offline_access' }).then((createdToken) => {
      if (utils.verifyToken(createdToken)) {
        token = createdToken;
      }
    });
    done();
  });

  afterEach(async (done) => {
    await User.remove({});
    await Post.remove({});
    await Client.remove({});
    done();
  });

  afterAll(() => mongoose.disconnect());

  test('return 200 status code, GET /api/post', () => request(app)
    .get('/api/post')
    .expect(200));

  test('return 401 status code, POST /api/post', () => request(app)
    .post('/api/post')
    .set('Content-Type', 'application/json')
    .send({})
    .expect(401));

  test('should return a post if everything is valid, POST /api/post', () => request(app)
    .post('/api/post')
    .auth('abc123', 'ssh-secret')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Lorem Ten Word',
      content: 'Ipsum',
      url: 'https://www.nytimes.com',
      author: savedUser.id,
    })
    .expect(201)
    .then((res) => {
      expect(JSON.parse(res.text)).toHaveProperty('title', 'Lorem Ten Word');
      expect(JSON.parse(res.text)).toHaveProperty('author', savedUser.id);
    }));

  test('should update post if everything is valid. PUT /api/post/edit', () => request(app)
    .put('/api/post/edit')
    .auth('abc123', 'ssh-secret')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({
      id: savedPost.id,
      title: 'Lorem Ten Word Edit',
      content: 'Ipsum',
      url: 'https://www.nytimes.com',
      author: savedUser.id,
    })
    .expect(200)
    .then((res) => {
      expect(JSON.parse(res.text)).toHaveProperty('title', 'Lorem Ten Word Edit');
    }));

  test('should delete post if user own the post. DELETE /api/post', () => request(app)
    .delete('/api/post/delete')
    .auth('abc123', 'ssh-secret')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send({ id: savedPost.id, author: savedUser.id })
    .expect(200)
    .then(res => expect(JSON.parse(res.text)).toHaveProperty('success', 'Gönderi silindi')));
});
