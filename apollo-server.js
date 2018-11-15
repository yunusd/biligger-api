const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    isAuthenticated: req.user,
  }),
});

module.exports = server;
