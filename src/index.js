// Dependencias
import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import 'dotenv/config';

import Path from 'path';
import Cors from 'cors';

import Mongoose from 'mongoose';
Mongoose.Promise = global.Promise;

// Modulo de autenticacion
import Auth from '../src/auth';

// ./graphql/typeDefs.js y ./graphql/resolvers.js
const typeDefs = mergeTypes(fileLoader(Path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(Path.join(__dirname, './resolvers')));

import Models from './models';

const app = Express();
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
    app.listen({ port: process.env.PORT || 4001 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  })
  .catch(err => console.error(err));
