const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Confirmation = `
  type Confirmation {
    hash: Boolean,
    expired: Boolean,
  }

  extend type Query {
    verifyHash(hash: String!, action: Int!): Confirmation
  }

  extend type Mutation {
    sendConfirmationEmail(email: String!, action: Int!): Confirmation
  }
`;

module.exports = Confirmation;
