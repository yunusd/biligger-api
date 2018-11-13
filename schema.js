const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

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
  // mutations
);

const schema = makeExecutableSchema({
  typeDefs: [
    Root,
  ],
  resolvers,
});

module.exports = schema;
