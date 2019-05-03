const Search = `
  extend type Query {
    searchPosts(text: String!, offset: Int!, limit: Int!): [Post],
  }
`;

module.exports = Search;
