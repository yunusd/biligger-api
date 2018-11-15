const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

const User = require('./types/User');
const userQueries = require('./queries/user');
const registerUserMutation = require('./mutations/user');

const { AuthorizeDirective } = require('./directives/auth');

const Root = `
  type Query {
    dummy: String
  },
  type Mutation {
    dummy: String
  },
  schema {
    query: Query,
    mutation: Mutation,
  }
`;

const resolvers = merge(
  {},
  // queries
  userQueries,
  // mutations
  registerUserMutation,
);

const schema = makeExecutableSchema({
  typeDefs: [
    Root,
    User,
  ],
  resolvers,
  schemaDirectives: {
    isAuthorized: AuthorizeDirective,
  },
});

module.exports = schema;
