const { Schema, model } = require('mongoose');
const Joi = require('joi');

const authSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  token: {
    type: String,
    default: null,
  },
});

const joiSchema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().required(),
  password: Joi.string().min(4).required(),
});

const User = model('user', authSchema);

module.exports = {
  joiSchema,
  User,
};
