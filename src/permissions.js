const { createResolver } =  require('apollo-resolvers');

export const baseResolver = createResolver(
  null,
  (root, args, context, error) => error
);

export const isAuthenticatedResolver = baseResolver.createResolver(
  (root, args, { user }, info) => {
    if (!user) throw new Error("No autenticado");
  }
);