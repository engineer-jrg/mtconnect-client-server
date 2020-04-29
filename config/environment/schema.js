module.exports =  {
  env: {
    doc: "El entorno de la aplicación.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 4000,
    env: "PORT"
  },
  secret: {
    doc: 'Clave secreta para el token.',
    format: String,
    default: '1234567890abcdefghijklmnopqrstuv',
    env: "SECRET"
  },
  urlClient: {
    doc: "La url del cliente para la api",
    format: 'url',
    default: 'http://localhost:8080/',
    env: "URL_CLIENT"
  },
  db: {
    host: {
      doc: 'Host de base de datos.',
      format: '*',
      default: 'mongodb://127.0.0.1:27017/',
      env: "DB_HOST"
    },
    name: {
      doc: 'Nombre de la base de datos.',
      format: String,
      default: 'mtconnect-client-dev',
      env: "DB_NAME"
    },
    user: {
      doc: 'Usuario de la base de datos.',
      format: String,
      default: '',
      env: "DB_USER"
    },
    password: {
      doc: 'Contraseña de la base de datos.',
      format: String,
      default: '',
      env: "DB_PASSWORD"
    },
    suffix: {
      doc: 'Sufijo de la base de datos.',
      format: String,
      default: '',
      env: "DB_SUFFIX"
    },
    type: {
      doc: "El tipo de conexión.",
      format: ["mongoLocal", "mongoCloud"],
      default: "mongoLocal",
      env: "DB_TYPE"
    }
  }
}
