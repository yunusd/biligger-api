const User = `
  directive @isAuthorized on FIELD_DEFINITION
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
    getUser(id: ID!): User,
  }

  extend type Mutation {
    registerUser(username: String!, password: String!, passwordCheck: String!, email: String!, degree: String, bio: String): User
    editUser(password: String!, passwordCheck: String!, email: String!, degree: String, bio: String): User @isAuthorized
    deleteUser: User @isAuthorized
  }
`;

module.exports = User;
