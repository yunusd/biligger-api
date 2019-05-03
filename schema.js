const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

const User = require('./types/User');
const Post = require('./types/Post');
const Comment = require('./types/Comment');
const Category = require('./types/Category');
const Search = require('./types/Search');
const Like = require('./types/Like');

const userQueries = require('./queries/user');
const postQueries = require('./queries/post');
const categoryQueries = require('./queries/category');
const commentQueries = require('./queries/comment');
const searchQueries = require('./queries/search');
const likeQueries = require('./queries/like');

const userMutation = require('./mutations/user');
const postMutation = require('./mutations/post');
const CommentMutation = require('./mutations/comment');
const LikeMutation = require('./mutations/like');

const CommentParent = require('./unions/commentParent');
const LikeParent = require('./unions/likeParent');

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
  commentQueries,
  categoryQueries,
  searchQueries,
  likeQueries,
  // mutations
  userMutation,
  postMutation,
  CommentMutation,
  LikeMutation,
  // union
  CommentParent,
  LikeParent,
);

const schema = makeExecutableSchema({
  typeDefs: [
    Root,
    User,
    Post,
    Comment,
    Category,
    Search,
    Like,
  ],
  resolvers,
  schemaDirectives: {
    isAuthorized: AuthorizeDirective,
    hasScope: ScopeDirective,
  },
});

module.exports = schema;
