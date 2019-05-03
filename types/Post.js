const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Post = `
  directive @isAuthorized on FIELD_DEFINITION
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
  scalar Date
  type Post {
    id: ID,
    title: String,
    content: String,
    url: String,
    like: Boolean,
    countLike: Int!,
    author: User,
    category: Category,
    createdAt: Date,
  }

  extend type Query {
    getPost(id: ID!): Post
    getLatestPosts(offset: Int!, limit: Int!): [Post!]!
    getLatestPostsByCategory(category: String!, offset: Int!, limit: Int!): [Post],
    getPostsByUser(id: ID!, offset: Int!, limit: Int!): [Post],
  }

  extend type Mutation {
    addPost(title: String!, content: String!, url: String, category: String!): Post @hasScope(actions: ["create_post", "admin"]) 
    editPost(id: ID!, title: String!, content: String!, url: String, category: String!, author: ID!): Post @hasScope(actions: ["edit_post", "admin"]) 
    deletePost(id: ID!, author: ID!): Post @hasScope(actions: ["delete_post", "admin"]) 
  }
`;

module.exports = Post;
