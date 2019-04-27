const Comment = `
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION

  type Comment {
    id: ID!,
    content: String,
    like: [ID!],
    author: User,
    post: Post,
    createdAt: Date,
  }

  extend type Query {
    getComment(id: ID!): Comment,
    getLatestComments(post: ID!): [Comment!]!,
    getUserComments(author: ID!): [Comment],
  }
  
  extend type Mutation {
    addComment(content: String!, post: ID!): Comment @hasScope(actions: ["create_comment"]),
    editComment(id: ID!, content: String!, author: ID!): Comment @hasScope(actions: ["edit_comment"]),
    deleteComment(id: ID!, author: ID!): Comment @hasScope(actions: ["delete_comment"]),
  }
`;

module.exports = Comment;
