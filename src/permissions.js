const { createResolver } =  require('apollo-resolvers');

const baseResolver = createResolver(
  null,
  (root, args, context, error) => error
);

const isAuthenticatedResolver = baseResolver.createResolver(
  (root, args, { user }, info) => {
    if (!user) throw new Error("No autenticado");
  }
);

exports.baseResolver = baseResolver;
exports.isAuthenticatedResolver = isAuthenticatedResolver;