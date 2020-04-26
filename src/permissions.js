const { createResolver } = require('apollo-resolvers');

const isAuthenticatedResolver = createResolver(
  (root, args, { user }) => {
    if (!user) {
      return {
        success: false,
        errors: [
          { path: 'allUser', message: 'No autenticado' },
        ],
      };
    }
    return undefined;
  },
);

exports.isAuthenticatedResolver = isAuthenticatedResolver;
