const { makeExecutableSchema } = require('apollo-server-express');
const { merge } = require('lodash');

const User = require('./types/User');
const Post = require('./types/Post');
const Comment = require('./types/Comment');
const Category = require('./types/Category');
const Search = require('./types/Search');
const Like = require('./types/Like');
const Notification = require('./types/Notification');

const userQueries = require('./queries/user');
const postQueries = require('./queries/post');
const categoryQueries = require('./queries/category');
const commentQueries = require('./queries/comment');
const searchQueries = require('./queries/search');
const likeQueries = require('./queries/like');
const notificationQueries = require('./queries/notification');

const userMutation = require('./mutations/user');
const postMutation = require('./mutations/post');
const commentMutation = require('./mutations/comment');
const likeMutation = require('./mutations/like');
const notificationMutation = require('./mutations/notification');

const CommentParent = require('./unions/commentParent');
const LikeParent = require('./unions/likeParent');

const { ScopeDirective } = require('./directives/auth');

const Root = `
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
  // mutations
  userMutation,
  postMutation,
  commentMutation,
  likeMutation,
  notificationMutation,
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
  ],
  resolvers,
  schemaDirectives: {
    hasScope: ScopeDirective,
  },
});

module.exports = schema;
