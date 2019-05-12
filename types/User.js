const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const User = `
  directive @isAuthorized on FIELD_DEFINITION
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
  type User {
    id: ID!,
    username: String,
    password: String,
    passwordCheck:  String,
    email: String @isAuthorized,
    degree: String,
    roles: String,
    bio: String,
  }

  extend type Query {
    getUser(username: String!): User,
    getMe: User @hasScope(actions: ["create_post", "admin"])
  }

  extend type Mutation {
    registerUser(invitationCode: String!, username: String!, password: String!, passwordCheck: String!, email: String!, degree: String, bio: String): User
    editUser(password: String!, newPassword: String, newPasswordCheck: String, email: String, degree: String, bio: String): User @hasScope(actions: ["create_post", "admin"])
    deleteUser: User @isAuthorized
  }
`;

module.exports = User;
