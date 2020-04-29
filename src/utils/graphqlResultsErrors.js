const errorName = {
  QUERY_NOT_FOUND: 'QUERYNOTFOUND',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASS: 'INVALID_PASS',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

const typeError = {
  QUERY_NOT_FOUND: {
    message: 'No se pudo abtener la consulta.',
  },
  INVALID_EMAIL: {
    message: 'Este correo no se encuentra registrado.',
  },
  INVALID_PASS: {
    message: 'La contraseña no es correcta.',
  },
  UNAUTHORIZED: {
    message: 'Se necesita autenticación para obtener la respuesta solicitada.',
  },
};

const arrayFormat = (possibleArray) => {
  if (possibleArray.length) {
    return possibleArray;
  }
  return [possibleArray];
};

const getError = (path, type) => ({
  success: false,
  errors: [{
    path,
    message: typeError[type].message,
  }],
});

const formatError = (path, message) => ({
  success: false,
  errors: [{
    path,
    message,
  }],
});

const formatErrors = (errors) => {
  const arrayFormattedErrors = [];
  arrayFormat(errors).forEach((error) => {
    if (error.errors) {
      Object.entries(error.errors).forEach((err) => {
        arrayFormattedErrors.push({
          message: err[1].message,
          path: err[1].path || err[1].name || 'UNDEFINED',
        });
      });
    } else {
      arrayFormattedErrors.push({
        message: error.message,
        path: error.path || error.name || 'UNDEFINED',
      });
    }
  });
  return {
    success: false,
    errors: arrayFormattedErrors,
  };
};

exports.getError = getError;
exports.errorName = errorName;
exports.typeError = typeError;
exports.formatErrors = formatErrors;
exports.formatError = formatError;
