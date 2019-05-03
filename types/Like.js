const Like = `
  directive @hasScope(actions: [String!]!) on FIELD_DEFINITION
  union LikeParent = Post | Comment
  type Like {
    liked: Boolean
  }

  type UserLikes {
    parent: LikeParent
  }

  extend type Query {
    getLikes: [UserLikes] @hasScope(actions: ["create_comment"]),
  }
  
  extend type Mutation {
    addLike(id: ID!, parentModel: String!): Like @hasScope(actions: ["create_comment"]),
    removeLike(id: ID!, parentModel: String!): Like @hasScope(actions: ["create_comment"]),
  }
`;

module.exports = Like;
