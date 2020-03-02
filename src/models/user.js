import Mongoose, { Schema, SchemaTypes } from 'mongoose';
require('mongoose-type-email');

Mongoose.SchemaTypes.Email.defaults.message = 'Correo no valido';

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    index: { unique: true }
  },
  email: {
    type: Mongoose.SchemaTypes.Email,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = Mongoose.model('User', userSchema);

export default userModel;
