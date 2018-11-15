const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

module.exports.AuthorizeDirective = class AuthorizeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const context = args[2];
      if (context.isAuthenticated) {
        const result = await resolve.apply(this, args);
        if (context.isAuthenticated.id !== args[0].id) throw new AuthenticationError('Unauthorized');
        return result.toUpperCase();
      }
      throw new AuthenticationError('Unauthenticated');
    };
  }
};
