const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

module.exports.AuthorizeDirective = class AuthorizeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const [, , context] = args;
      if (context.isAuthenticated) {
        const result = await resolve.apply(this, args);
        return result;
      }
      throw new AuthenticationError('Unauthenticated');
    };
  }
};
