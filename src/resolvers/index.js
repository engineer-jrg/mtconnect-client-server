import UserResolver from './user';

const resolvers = {
  Query: {
    hello: () => 'Hello MTConnect Clien!',
    allUser: UserResolver.allUser,
    getUser: UserResolver.getUser
  },

  Mutation: {
    createUser: UserResolver.createUser
  }
};

export default resolvers;
