const Like = `
  union LikeParent = Post | Comment
  type Like {
    liked: Boolean
  }

  type UserLikes {
    parent: LikeParent
  }

  extend type Query {
    getLikes(offset: Int!, limit: Int!): [UserLikes] @hasScope(actions: ["view_like"]),
  }
  
  extend type Mutation {
    addLike(id: ID!, parentModel: String!): Like @hasScope(actions: ["create_like"]),
    removeLike(id: ID!, parentModel: String!): Like @hasScope(actions: ["delete_like"]),
  }
`;

module.exports = Like;
