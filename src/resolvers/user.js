const Auth = require('../auth');
const { isAuthenticatedResolver } = require('../permissions');
const {
  getError, errorName, formatErrors,
} = require('../utils/graphqlResultsErrors');

// Revolvers para usuarios
const Query = {
  hello: () => 'Hello MTConnect Client!',

  allUser: isAuthenticatedResolver.createResolver(
    async (parent, args, { Models }) => {
      const users = await Models.User.find();
      if (users) {
        return { success: true, users };
      }
      return getError('allUser', errorName.QUERY_NOT_FOUND);
    },
  ),

  getUser: async (parent, args, { Models }) => {
    try {
      const user = await Models.User.findOne(args);
      if (user) return { success: true, user, errors: [] };
    } catch (error) {
      return formatErrors(error);
    }
    return getError('getUser', errorName.QUERY_NOT_FOUND);
  },
};

const Mutation = {
  // Crear un usuario
  createUser: async (parent, { password, ...args }, { Models }) => {
    try {
      const user = await Models.User.create({ password, ...args });
      if (!user) {
        return { success: true, errors: [], token: Auth.getToken(user) };
      }
      return getError('createUser', errorName.QUERY_NOT_FOUND);
    } catch (error) {
      return formatErrors(error);
    }
  },

  // Logear usuario
  loginUser: async (parent, { email, password }, { Models }) => Auth.login(
    email, password, Models,
  ),
};


exports.Query = Query;
exports.Mutation = Mutation;
