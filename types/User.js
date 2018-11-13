const User = `
  type User {
    id: ID!,
    username: String,
    password: String,
    email: String,
    degree: String,
    roles: String,
    bio: String,
  }

  extend type Query {
    getUser(username: String!): User,
  }

  extend type Mutation {
    registerUser(username: String, password: String, email: String, degree: String, bio: String): User
  }
`;

module.exports = User;
