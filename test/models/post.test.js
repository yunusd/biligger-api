const mongoose = require('mongoose');
const { Post, User } = require('../../models');

describe('post', () => {
  let savedPost = {};
  let savedUser = {};

  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database

  beforeEach(async (done) => {
    await Post.remove({});
    await User.remove({});

    savedUser = await User.create({
      username: 'bob',
      password: 'secret',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });

    savedPost = await Post.create({
      title: 'Lorem',
      content: 'Ipsum',
      url: 'https://www.nytimes.com',
      author: savedUser.id,
    });
    done();
  });

  afterEach(() => Post.remove({}));

  afterAll(() => mongoose.disconnect());

  test('should not find a post by invalid id', async () => {
    const post = await Post.findById('000000000000000000000000');
    expect(post).toBeNull();
  });

  test('should find a post by id', async () => {
    const post = await Post.findById(savedPost.id);

    expect(post).toHaveProperty('author', savedUser._id);
    expect(post).toHaveProperty('title', 'Lorem');
    expect(post).toHaveProperty('content', 'Ipsum');
    expect(post).toHaveProperty('url', 'https://www.nytimes.com');
  });

  test('should find a post by username', async () => {
    const post = await Post.findOne({ username: savedPost.username });
    expect(post).toHaveProperty('title', 'Lorem');
    expect(post).toHaveProperty('content', 'Ipsum');
    expect(post).toHaveProperty('url', 'https://www.nytimes.com');
  });
});
