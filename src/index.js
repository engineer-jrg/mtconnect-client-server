// Dependencias
const Express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { fileLoader, mergeTypes, mergeResolvers }  =  require('merge-graphql-schemas');
require('dotenv').config();

const Path =  require('path');
const Cors =  require('cors');

const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;

// Modulo de autenticacion
const Auth = require('./auth');

// ./graphql/typeDefs.js y ./graphql/resolvers.js
const typeDefs = mergeTypes(fileLoader(Path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(Path.join(__dirname, './resolvers')));

const Models = require('./models');

const app = Express();
app.set('port', process.env.PORT || 4000);
app.use(Cors({
  origin: [process.env.URL_CLIENT]
}));
app.use(Auth.checkHeaders);

const path = '/graphql';
app.get('/', function (req, res, next) {
  res.set('Content-Type', 'text/html');
  res.send(new Buffer('<h2>👋 Hello Api MTConnect Client 🚀</h2><br>\
                        <span>Ingresar: \
                          <a href="'+path+'" style="text-decoration: none;">📦 Api</a>\
                        </span>'));
  res.send(', visita: '+path);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    return {
      Models: Models.models,
      SECRET: process.env.PORT,
      user: req.user
    }
  },
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, path });

//  Conexion a mongoDB
// pass: mt-connect-2020 || bklL4rwU7RfXDIdu
const uri_db_cloud = "mongodb+srv://mtconnect-client-user:pass:mt-connect-2020@cluster0-eh1rd.mongodb.net/test?retryWrites=true&w=majority";
Mongoose.connect(process.env.MONGODB_URI || uri_db_cloud, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(db => {
    console.log('DB is connected');
  })
  .catch(err => console.error(err));

// Lanzamiento del servidor
app.listen( app.get('port'), () =>
console.log(`🚀 Server ready at http://localhost:${app.get('port')}${server.graphqlPath}`)
);
