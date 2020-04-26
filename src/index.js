const { ApolloServer } = require('apollo-server-express');
const Cors = require('cors');
const Dotenv = require('dotenv');
const Express = require('express');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const Mongoose = require('mongoose');
const Path = require('path');

const Config = require('../config/environment/config');
const Auth = require('./auth');
const Models = require('./models');

// Configuracion de promesas en moongose
Mongoose.Promise = global.Promise;

Dotenv.config();

// ./graphql/typeDefs.js y ./graphql/resolvers.js
const typeDefs = mergeTypes(fileLoader(Path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(Path.join(__dirname, './resolvers')));

const app = Express();
app.set('port', Config.get('port') || 4000);
app.use(Cors({
  origin: [Config.get('urlClient')],
}));
app.use(Auth.checkHeaders);

const pathGQL = '/graphql';
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from((`<h2>👋 Hello Api MTConnect Client 🚀</h2><br>\
                        <span>Ingresar: \
                          <a href="${pathGQL}" style="text-decoration: none;">📦 Api</a>\
                        </span>`)));
  res.send(`, visita: ${pathGQL}`);
});
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    Models: Models.models,
    SECRET: Config.get('secret'),
    user: req.user,
  }),
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, pathGQL });

let mongoUri = Config.get('db.host') || null;
if (Config.get('db.user')) {
  mongoUri = `${mongoUri
  + Config.get('db.user')
  }:${Config.get('db.password')
  }${Config.get('db.suffix')}`;
}

Mongoose.connect(mongoUri || Config.default('db.host'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('DB is connected');
})
  .catch((err) => {
    console.log('X Error DB no connected');
    console.error(err);
  });

// Lanzamiento del servidor
app.listen(app.get('port'), () => console.log(`🚀 Server ready at http://localhost:${app.get('port')}${server.graphqlPath}`));
