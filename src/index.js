const { ApolloServer } = require('apollo-server-express');
const Cors = require('cors');
const Dotenv = require('dotenv');
const Express = require('express');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const Mongoose = require('mongoose');
const Path = require('path');

const Auth = require('./auth');
const Models = require('./models');


// Configuracion de promesas en moongose
Mongoose.Promise = global.Promise;

Dotenv.config();

// ./graphql/typeDefs.js y ./graphql/resolvers.js
const typeDefs = mergeTypes(fileLoader(Path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(Path.join(__dirname, './resolvers')));

const app = Express();
app.set('port', process.env.PORT || 4000);
app.use(Cors({
  origin: [process.env.URL_CLIENT],
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
    SECRET: process.env.SECRET,
    user: req.user,
  }),
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, pathGQL });

// pass: mt-connect-2020 || bklL4rwU7RfXDIdu
const uriDbCloud = 'mongodb+srv://mtconnect-client-user:mt-connect-2020@cluster0-eh1rd.mongodb.net/mtconnect-client?retryWrites=true&w=majority';
Mongoose.connect(process.env.MONGODB_URI || uriDbCloud, {
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
