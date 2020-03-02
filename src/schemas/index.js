import { gql } from 'apollo-server-express';
import UserSchema from './user';

const typeDefs = gql`

  ${UserSchema.typeUser}

  type Query {
    hello: String,
    ${ UserSchema.allUser },
    ${ UserSchema.getUser }
  }

  type Mutation{
    ${ UserSchema.createUser }
  }
`;

export default typeDefs;
