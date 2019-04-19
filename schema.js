const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

const User = require('./types/User');
const Post = require('./types/Post');

const Comment = require('./types/Comment');

const userQueries = require('./queries/user');
const postQueries = require('./queries/post');

const userMutation = require('./mutations/user');
const postMutation = require('./mutations/post');

const commentMutation = require('./mutations/comment');

const { AuthorizeDirective, ScopeDirective } = require('./directives/auth');

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
  postQueries,
  // mutations
  userMutation,
  postMutation,
  commentMutation,
  // editUserMutation,
);

const schema = makeExecutableSchema({
  typeDefs: [
    Root,
    User,
    Post,
    Comment,
  ],
  resolvers,
  schemaDirectives: {
    isAuthorized: AuthorizeDirective,
    hasScope: ScopeDirective,
  },
});

module.exports = schema;
