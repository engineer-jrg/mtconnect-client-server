// Dependencias
const Express = require('express');
const ApolloServer = require('apollo-server-express');
const MergeGraphqlSchemas  =  require('merge-graphql-schemas');
const fileLoader = MergeGraphqlSchemas.fileLoader;
const mergeTypes = MergeGraphqlSchemas.mergeTypes;
const mergeResolvers = MergeGraphqlSchemas.mergeResolvers;
require('dotenv').config();

const Path =  require('path');
const Cors =  require('cors');

const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;

// Modulo de autenticacion
const Auth = require('../src/auth');

// ./graphql/typeDefs.js y ./graphql/resolvers.js
const typeDefs = mergeTypes(fileLoader(Path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(Path.join(__dirname, './resolvers')));

const Models = require('./models');

const app = Express();

app.set('port', process.env.PORT || 4001)

app.use(Cors({
  origin: [process.env.URL_CLIENT]
}));

app.use(Auth.checkHeaders);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    return {
      Models,
      SECRET: process.env.PORT,
      user: req.user
    }
  }
});

server.applyMiddleware({ app });

//  Conexion a mongoDB
Mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mtconnect-client', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(db => {
    console.log('DB is connected');
    // Lanzamiento del servidor
    app.listen( app.get('port'), () =>
      console.log(`🚀 Server ready at http://localhost:${app.get('port')}${server.graphqlPath}`)
    );
  })
  .catch(err => console.error(err));
