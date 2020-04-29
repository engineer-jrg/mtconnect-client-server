const { createResolver } = require('apollo-resolvers');

const { getError, errorName } = require('./utils/graphqlResultsErrors');

const isAuthenticatedResolver = createResolver(
  (root, args, { user }) => {
    if (!user) {
      return getError('isAuthenticatedResolver', errorName.UNAUTHORIZED);
    }
    return undefined;
  },
);

exports.isAuthenticatedResolver = isAuthenticatedResolver;
