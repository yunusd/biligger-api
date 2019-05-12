const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

/* TODO: REFACTOR THIS */
module.exports.ScopeDirective = class ScopeDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { actions } = this.args;
    field.resolve = async (...args) => {
      const [, arg, context] = args;
      if (context.isAuthenticated) {
        const role = context.isAuthenticated.roles;
        const scope = await context.scope.getScope(role);
        let failedScope = false;
        actions.forEach((val) => {
          const res = scope.indexOf(val) >= 0; // 0 === true

          if (!res && val !== 'admin') failedScope = true;
        });

        if (arg.author && context.isAuthenticated.id != arg.author) {
          throw new AuthenticationError('Unauthorized');
        }

        if (failedScope === true) throw new AuthenticationError('Unauthorized');

        return resolve.apply(this, args);
      }
      throw new AuthenticationError('Unauthenticated');
    };
  }
};
