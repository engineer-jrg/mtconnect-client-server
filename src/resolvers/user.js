// Dependencias
const Bcrypt = require('bcrypt');

// Modulo de autenticacion
const Auth = require('../auth');
const { isAuthenticatedResolver } = require('../permissions');

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
        objErrors.push({ 
          message: error.errmsg ? error.errmsg : "Error desconocido",
          path:  error.path ? error.path : "Desconocido" });
        break;
    }
  }else{
    return error;
  }
  return objErrors;
}

// Constante de revolvers para usuarios

const Query = {
  hello: () => 'Hello MTConnect Client!',

  allUser: isAuthenticatedResolver.createResolver(
    (parent , args, { Models }, info, error) => {
      if(info.custom_errors){
        let errors = [];
        if(info.custom_errors[0]){
          errors = info.custom_errors;
        }else{
          errors.push(info.custom_errors)
        }
        return { success: false, users: [], errors: errors }
      }
      return Models.User.find();
    }
  ),

  getUser: async (parent , args, { Models }) => {
    try {
      const current_user = await Models.User.findOne(args);
      return { success: true, user: current_user, errors: [] };
    } catch (error) {
      return { success: false, user: null, errors: formatError(error) };
    }
  }
}

const Mutation = {
  // Crear un usuario
  createUser: async (parent , {password, ...args}, { Models }) => {
    const otherErrors = [];
    try {
      if(password.length<6){
        otherErrors.push({ path: "password", message: "La contraseña debe ser mayor a 6 caracteres" });
      }
      if(otherErrors.length){
        throw otherErrors;
      }
      const hasPassword = await Bcrypt.hash( password, 10);
      const user = await Models.User.create({ ...args, password: hasPassword });
      if(user._id){
        return { success: true, errors: [] , token: Auth.getToken(user)};
      }else{
        return { success: false, errors: [] };
      }
    } catch (error) {
      return { success: false, token: null, errors: formatError(error) };
    }
  },

  // Logear usuario
  loginUser: async (parent , { email, password }, { Models:{User}, SECRET }) => Auth.login(
    email, password, User, SECRET)
}


exports.Query = Query;
exports.Mutation = Mutation;
