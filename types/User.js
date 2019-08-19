const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const User = `
  type User {
    id: ID!,
    username: String,
    password: String,
    passwordCheck:  String,
    email: String @hasScope(actions: ["view_user", "admin"]),
    degree: String,
    roles: String,
    bio: String,
    active: Boolean,
  }

  extend type Query {
    getUser(username: String!): User,
    getMe: User @hasScope(actions: ["view_user", "admin"])
  }

  extend type Mutation {
    registerUser(invitationCode: String!, username: String!, password: String!, passwordCheck: String!, email: String!, degree: String, bio: String): User
    editUser(password: String!, newPassword: String, newPasswordCheck: String, email: String, degree: String, bio: String): User @hasScope(actions: ["edit_user", "admin"])
    deleteUser: User @hasScope(actions: ["delete_user", "admin"])
    resetUserPassword(hash: String!, newPassword: String!, newPasswordCheck: String!): User
  }
`;

module.exports = User;
