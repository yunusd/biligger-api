const Post = `
  directive @isAuthorized on FIELD_DEFINITION
  
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
    addPost(title: String!, content: String!, url: String, author: String!): Post
    editPost(id: ID!, title: String!, content: String!, url: String): Post @isAuthorized 
    deletePost(id: ID!): Post @isAuthorized
  }
`;

module.exports = Post;
