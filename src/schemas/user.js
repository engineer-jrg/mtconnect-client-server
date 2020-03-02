const typeUser = `type User{
  _id: ID!
  first_name: String!
  last_name: String
  username: String!
  email: String!
  password: String!
}`;

// Mutaciones
const createUser = `
  createUser(first_name: String!, last_name: String, username: String!, email: String!, password: String!): User!
`;
// Querys
const allUser = `
  allUser: [User]!
`;

const getUser = `
  getUser(_id: ID!): User!
`;

// Constante a exportar para user esquema
const userSchema = {
  typeUser,
  createUser,
  allUser,
  getUser
}

export default userSchema;
