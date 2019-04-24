const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const config = require('./config');

const server = new ApolloServer({
  schema,
  cors: config.corsOptions,
  context: ({ req }) => ({
    isAuthenticated: req.user,
    scope: req.scope,
  }),
});

module.exports = server;
