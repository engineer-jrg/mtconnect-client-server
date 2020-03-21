// Dependencias
import Mongoose, { Schema, SchemaTypes } from 'mongoose';
import Validate from 'mongoose-validator';

// Constante para el esquema de usuarios
const userSchema = new Schema({
  // Campos del usuario
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
    index: { unique: true },
    validate: Validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'El nombre del usuario debe estar entre {ARGS[0]} y {ARGS[1]} caracteres',
    })
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: Validate({
      validator: 'isEmail',
      message: 'Introduce un correo valido',
    })
  },
  password: {
    type: String,
    required: true
  }
});

const userModel = Mongoose.model('User', userSchema);

export default userModel;
