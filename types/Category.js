const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Category = `
  type Category {
    id: ID!,
    name: String,
  }

  extend type Query {
    getCategory(id: ID!): Category,
  }
`;

module.exports = Category;
