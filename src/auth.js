const Bcrypt = require('bcrypt');
const JsonWebToken = require('jsonwebtoken');

const Config = require('../config/environment/config');
const { Models } = require('./models/index');
const {
  getError, errorName,
} = require('./utils/graphqlResultsErrors');

// Obtener un token de sesión
const getToken = ({ _id: id }) => {
  const token = JsonWebToken.sign({ user: { id } }, Config.get('secret'), { expiresIn: '10s' });
  return token;
};

// funcion para logear al usuario
const login = async (email, password, { User }) => {
  const user = await User.findOne({ email });
  if (!user) {
    return getError('email', errorName.INVALID_EMAIL);
  }
  const validPassword = await Bcrypt.compare(password, user.password);
  if (!validPassword) {
    return getError('password', errorName.INVALID_PASS);
  }
  return {
    success: true,
    token: getToken(user),
  };
};

// verificar el estado de un token
const checkToken = async (token) => {
  try {
    const { user } = JsonWebToken.decode(token);
    if (user) {
      const userExists = await Models.User.findOne({ _id: user.id }, { _id: 1 });
      const { _id: id } = userExists;
      if (id) {
        const newToken = getToken(userExists);
        return {
          user: { id },
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
