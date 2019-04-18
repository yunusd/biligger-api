const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');

const mongoose = require('mongoose');
const schema = require('../../../schema');
const { User } = require('../../../models');

const GET_USER = `
  query getUser($id: ID!){
    getUser(id: $id){
      username
    }
  }
`;

describe('getUser', () => {
  beforeAll(() => mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })); // Connection to test database
  beforeEach(() => {
    const user = new User({
      username: 'bob',
      password: 'Secret1*',
      email: 'email@email.com',
      roles: 'user',
      degree: 'soft',
    });
    const savedUser = user.save();

    return Promise.all([
      savedUser,
    ]);
  });

  afterEach(async (done) => {
    await User.remove({});
    done();
  });

  afterAll(() => mongoose.disconnect());
  it('should return user if user id valid', async () => {
    const { id } = await User.findOne({ username: 'bob' });
    const server = new ApolloServer({
      schema,
    });
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_USER,
      variables: { id },
    });
    const { getUser } = res.data;
    expect(getUser).toHaveProperty('username', 'bob');
  });
});
