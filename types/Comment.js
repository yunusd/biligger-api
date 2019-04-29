const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Comment = `
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION

  type Comment {
    id: ID,
    content: String,
    parent: Parent,
    parentModel: String,
    like: [ID!],
    author: User,
    createdAt: Date,
  }

  type Parent {
    post: Post,
    comment: Comment
  }
  
  extend type Query {
    getComment(id: ID!): Comment,
    getLatestComments(parent: ID!): [Comment!]!,
    getUserComments(author: ID!): [Comment],
  }
  
  extend type Mutation {
    addComment(content: String!, parent: ID!, parentModel: String!): Comment @hasScope(actions: ["create_comment"]),
    editComment(id: ID!, content: String!, author: ID!): Comment @hasScope(actions: ["edit_comment"]),
    deleteComment(id: ID!, author: ID!): Comment @hasScope(actions: ["delete_comment"]),
  }
`;

module.exports = Comment;
