const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

const User = require('./types/User');
const Post = require('./types/Post');
const Comment = require('./types/Comment');
const Category = require('./types/Category');
const Search = require('./types/Search');
const Like = require('./types/Like');
const Notification = require('./types/Notification');
const Confirmation = require('./types/Confirmation');

const userQueries = require('./queries/user');
const postQueries = require('./queries/post');
const categoryQueries = require('./queries/category');
const commentQueries = require('./queries/comment');
const searchQueries = require('./queries/search');
const likeQueries = require('./queries/like');
const notificationQueries = require('./queries/notification');
const confirmationQueries = require('./queries/confirmation');

const userMutation = require('./mutations/user');
const postMutation = require('./mutations/post');
const commentMutation = require('./mutations/comment');
const likeMutation = require('./mutations/like');
const notificationMutation = require('./mutations/notification');
const confirmationMutation = require('./mutations/confirmation');

const CommentParent = require('./unions/commentParent');
const LikeParent = require('./unions/likeParent');

const { ScopeDirective } = require('./directives/auth');

const Root = `
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
  scalar Date
  type Query {
    dummy: String
  },
  type Mutation {
    dummy: String
  },
  type Subscription {
    dummy: String
  },
  schema {
    query: Query,
    mutation: Mutation,
    subscription: Subscription,
  }
`;

const resolvers = merge(
  {},
  // TODO: ADD SUBSCRIPTON FOR NOTIFICATIONS
  // {
  //   Subscription: {
  //     notifications: {
  //       subscribe: withFilter(
  //         (_, __, { pubsub }) => pubsub.asyncIterator(['NOTIFICATION']),
  //         (...args) => {
  //           // console.log('PAYLOAD: ', payload);
  //           // console.log('VARIABLES: ', variables);
  //           console.log('CONTEXT: ', args);
  //           // return payload.notifications.to.id === variables.to;
  //         },
  //       ),
  //     },
  //   },
  // },
  // queries
  userQueries,
  postQueries,
  commentQueries,
  categoryQueries,
  searchQueries,
  likeQueries,
  notificationQueries,
  confirmationQueries,
  // mutations
  userMutation,
  postMutation,
  commentMutation,
  likeMutation,
  notificationMutation,
  confirmationMutation,
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
    Notification,
    Confirmation,
  ],
  resolvers,
  schemaDirectives: {
    hasScope: ScopeDirective,
  },
});

module.exports = schema;
