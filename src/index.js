const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise

import typeDefs from './schemas';
import resolvers from './resolvers';

import Models from './models';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Models
  }
});

const app = express();
server.applyMiddleware({ app });

//  Conexion a mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mtconnect-client', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(db => {
    console.log('DB is connected');
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  })
  .catch(err => console.error(err));
