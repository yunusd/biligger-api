const mongoose = require('mongoose');

// Converting ObjectId to string so graphql can represent the value
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = () => this.toString();

const Report = `
  type Report {
    actor: ID,
    reporter: ID,
    entity: ID,
    entityRef: String,
    entityId: Int,
    message: String,
    createdAt: Date,
  }

  extend type Mutation {
    addReport(actor: ID!, reporter: ID!, entityRef: String!, entityId: Int!, message: String): Report @hasScope(actions: ["report_post", "report_comment"])
    deleteReport(id: ID!): Report @hasScope(actions: ["admin"])
  }
`;

module.exports = Report;
