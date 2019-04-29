const Search = `
  extend type Query {
    searchPosts(text: String!): [Post],
  }
`;

module.exports = Search;
