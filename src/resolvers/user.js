const Bcrypt = require('bcrypt');

const Auth = require('../auth');
const { isAuthenticatedResolver } = require('../permissions');

// Funcion para formaterar los errores
const formatError = (error) => {
  const { errors } = error;
  const objErrors = [];
  if (errors) {
    Object.entries(errors).forEach((e) => {
      const { message, path } = e[1];
      objErrors.push({ message, path });
    });
  } else if (error.name) {
    let path = '';
    switch (error.code) {
      case 11000:
        Object.entries(error.keyValue).forEach((err) => { path = err[0].toString(); });
        objErrors.push({
          message: 'Existe un campo duplicado en el formulario',
          path,
        });
        break;
      default:
        objErrors.push({
          message: error.errmsg ? error.errmsg : 'Error desconocido',
          path: error.path ? error.path : 'Desconocido',
        });
        break;
    }
  } else {
    return error;
  }
  return objErrors;
};

// Constante de revolvers para usuarios

const Query = {
  hello: () => 'Hello MTConnect Client!',

  allUser: isAuthenticatedResolver.createResolver(
    async (parent, args, { Models }) => {
      const users = await Models.User.find();
      if (users) {
        return { success: true, users };
      }
      return {
        success: false,
        errors: [
          { path: 'allUser', message: 'Error al consultar los usuarios' },
        ],
      };
    },
  ),

  getUser: async (parent, args, { Models }) => {
    try {
      const user = await Models.User.findOne(args);
      return { success: true, user, errors: [] };
    } catch (error) {
      return { success: false, user: null, errors: formatError(error) };
    }
  },
};

const Mutation = {
  // Crear un usuario
  createUser: async (parent, { password, ...args }, { Models }) => {
    const otherErrors = [];
    try {
      if (password.length < 6) {
        otherErrors.push({ path: 'password', message: 'La contraseña debe ser mayor a 6 caracteres' });
      }
      if (otherErrors.length) {
        throw otherErrors;
      }
      const hasPassword = await Bcrypt.hash(password, 10);
      const user = await Models.User.create({ ...args, password: hasPassword });
      const { _id: id } = user;
      if (id) {
        return { success: true, errors: [], token: Auth.getToken(user) };
      }
      return { success: false, errors: [] };
    } catch (error) {
      return { success: false, token: null, errors: formatError(error) };
    }
  },

  // Logear usuario
  loginUser: async (parent, { email, password }, { Models: { User }, SECRET }) => Auth.login(
    email, password, User, SECRET,
  ),
};


exports.Query = Query;
exports.Mutation = Mutation;
