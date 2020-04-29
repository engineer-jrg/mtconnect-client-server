const { ApolloServer } = require('apollo-server-express');
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require('merge-graphql-schemas');
const Path = require('path');

const Config = require('../../config/environment/config');
const { Models } = require('../models');

const typeDefs = mergeTypes(
  fileLoader(Path.resolve(__dirname, '../types')), {
    all: true,
  },
);

const resolvers = mergeResolvers(
  fileLoader(Path.resolve(__dirname, '../resolvers')),
);

const context = async ({ req }) => ({
  Models,
  Secret: Config.get('secret'),
  user: req.user,
});

const formatError = (err) => ({
  message: err.message,
  path: err.path || 'UNDEFINED',
});

const server = () => new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
  formatError,
});

exports.server = server;
