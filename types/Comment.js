const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Comment = `
  union CommentParent = Post | Comment

  type Comment {
    id: ID,
    content: String,
    parent: CommentParent,
    parentModel: String,
    like: Boolean,
    countLike: Int!,
    countReply: Int!,
    author: User,
    createdAt: Date,
  }
  
  extend type Query {
    getComment(id: ID!): Comment,
    getLatestComments(parent: ID!, offset: Int!, limit: Int!): [Comment!]!,
    getUserComments(author: ID!, offset: Int!, limit: Int!): [Comment],
  }
  
  extend type Mutation {
    addComment(content: String!, parent: ID!, parentModel: String!): Comment @hasScope(actions: ["create_comment"]),
    editComment(id: ID!, content: String!, author: ID!): Comment @hasScope(actions: ["edit_comment"]),
    deleteComment(id: ID!, author: ID!, parent: ID!, parentModel: String): Comment @hasScope(actions: ["remove_comment"]),
  }
`;

module.exports = Comment;
