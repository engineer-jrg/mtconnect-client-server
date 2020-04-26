const Bcrypt = require('bcrypt');
const Dotenv = require('dotenv');
const JsonWebToken = require('jsonwebtoken');

const Config = require('../config/environment/config');
const Models = require('./models/index');

Dotenv.config();

const getToken = ({ _id: id }) => {
  const token = JsonWebToken.sign({ user: { id } }, Config.get('secret'), { expiresIn: '10s' });
  return token;
};

// funcion para logear al usuario
const login = async (email, password, User) => {
  const errorsLogin = [];
  let successLogin = false;
  let tokenLogin = 'null';
  const user = await User.findOne({ email });
  if (!user) {
    errorsLogin.push({ path: 'email', message: 'Este correo no se encuentra registrado' });
  } else {
    const validPassword = await Bcrypt.compare(password, user.password);
    if (!validPassword) {
      errorsLogin.push({ path: 'password', message: 'La contraseña no es correcta' });
    } else {
      tokenLogin = getToken(user);
      successLogin = true;
    }
  }
  return {
    success: successLogin,
    token: tokenLogin,
    errors: errorsLogin,
  };
};

// verificar el estado de un token
const checkToken = async (token) => {
  try {
    const { user } = JsonWebToken.decode(token);
    if (user) {
      const { _id: id } = user;
      const userExist = await Models.models.User.findOne({ _id: id }).size();
      if (userExist) {
        const newToken = getToken(user);
        return {
          user: {
            _id: id,
          },
          token: newToken,
        };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

// funcion para leer los encabezados de la solicitud http
const checkHeaders = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = JsonWebToken.verify(token, Config.get('secret'));
      req.user = user;
    } catch (error) {
      // Token no valido
      const newToken = await checkToken(token);
      if (newToken) {
        req.user = newToken.user;
        if (newToken.token) {
          res.set('Access-Control-Expose-Headers', 'x-token');
          res.set('x-token', newToken.token);
        }
      }
    }
  }
  next();
};

exports.getToken = getToken;
exports.login = login;
exports.checkHeaders = checkHeaders;
exports.checkToken = checkToken;
