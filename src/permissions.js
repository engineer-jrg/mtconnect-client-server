const { createResolver } =  require('apollo-resolvers');

const isAuthenticatedResolver = createResolver(
  (root, args, { user }, info) => {
    if (!user){ //throw new Error("No autenticado");
      info.custom_errors = [{
        path: "allUser",
        message: "No autenticado"
      }]
    }
  }
);

exports.isAuthenticatedResolver = isAuthenticatedResolver;