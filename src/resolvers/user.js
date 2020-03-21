// Dependencias
import Bcrypt from 'bcrypt';

// Modulo de autenticacion
import Auth from '../auth';
import { isAuthenticatedResolver } from '../permissions';

// Funcion para formaterar los errores
const formatError = (error) => {
  const errors = error.errors;
  let objErrors = [];
  if(errors){
    Object.entries(errors).map( error => {
      const { message, path } = error[1];
      objErrors.push({ message, path });
    });
  }else if(error.name){
    switch (error.code) {
      case 11000:
        let error_path = "";
        Object.entries(error.keyValue).map( error => { error_path = error[0].toString() });
        objErrors.push({ message: "Existe un campo duplicado en el formulario",
          path:  error_path
        });
        break;
      default:
        objErrors.push({ message: error.errmsg, path:  "Desconocido" });
        break;
    }
  }else{
    return error;
  }
  return objErrors;
}

// Constante de revolvers para usuarios
const resolvers = {
  Query: {
    hello: () => 'Hello MTConnect Client!',
    allUser: isAuthenticatedResolver.createResolver(
      (parent , args, { Models }) => Models.User.find()
    ),
    getUser: async (parent , args, { Models }) => {
      const current_user = await Models.User.findOne(args);
      if(current_user){
        return {
          success: true,
          user: current_user,
          errors: []
        };
      }else{
        return {
          success: false,
          user: null,
          errors: [
            { 
              path: "usuario",
              message: "Usuario no encontrado"
            }
          ]
        }; 
      }
    }
  },

  Mutation: {
    // Crear un usuario
    createUser: async (parent , {password, ...args}, { Models }) => {
      const otherErrors = [];
      try {
        if(password.length<6){
          otherErrors.push({ path: "password", message: "La contraseña debe ser mayor a 6 caracteres"});
        }
        if(otherErrors.length){
          throw otherErrors;
        }
        const hasPassword = await Bcrypt.hash( password, 10);
        const user = await Models.User.create({ ...args, password: hasPassword });
        return {
          success: user._id ? true : false,
          errors: []
        };
      } catch (error) {
        return {
          success: false,
          errors: formatError(error)
        };
      }
    },

    // Logear usuario
    loginUser: async (parent , { email, password }, { Models:{User}, SECRET }) => Auth.login(
      email, password, User, SECRET)
  }
};

export default resolvers;
