// Dependencias
const { gql } = require('apollo-server-express');

// Constante de types para usuarios
const typeDefs = gql`

  type User{
    _id: ID!
    first_name: String!
    last_name: String
    username: String!
    email: String!
    password: String!
  }

  type Error{
    path: String!
    message: String!
  }

  type Response{
    success: Boolean!
    token: String
    user: User
    errors: [Error]
  }

  type Query {
    hello: String,
    allUser: [User]!,
    getUser(_id: ID!): Response!
  }

  type Mutation{
    createUser(
      first_name: String!,
      last_name: String,
      username: String!,
      email: String!,
      password: String!
    ): Response!

    loginUser(
      email: String!,
      password: String!
    ): Response!
  }
`;

// Exportacion de la constante types de usuarios
exports.typeDefs = typeDefs;
