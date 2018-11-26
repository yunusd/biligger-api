const Post = `
  directive @isAuthorized on FIELD_DEFINITION
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
  
  type Post {
    title: String!,
    content: String!,
    url: String,
    author: String!,
  }
  
  extend type Query {
    getPost(title: String!): Post
  }

  extend type Mutation {
    addPost(title: String!, content: String!, url: String): Post @hasScope(actions: ["create_post", "admin"]) 
    editPost(id: ID!, title: String!, content: String!, url: String, author: ID!): Post @hasScope(actions: ["edit_post", "admin"]) 
    deletePost(id: ID!, author: ID!): Post @hasScope(actions: ["delete_post", "admin"]) 
  }
`;

module.exports = Post;
