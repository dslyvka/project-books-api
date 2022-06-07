const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      min: [3, 'Too short name'],
      max: [100, 'Too long name'],
      match: [
        /^[^\s~!@#$%^&*()][\w\d\s!@#$%^&*()]{3,100}$/,
        'Please fill a valid name',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      min: [10, 'Too short email'],
      max: [63, 'Too long email'],
      match: [
        /^[^-.#!?,%$&^*()][\w-.#!?,%$&^*()]{2,}@([\w-]+\.)+[\w-.][^-.,!?#$]{1,4}$/,
        'Please fill a valid email address',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      min: [5, 'Too short password'],
      max: [30, 'Too long password'],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const joiSchema = Joi.object({
  email: Joi.string()
    .min(10)
    .max(63)
    .required()
    .pattern(
      /^[^-.#!?,%$&^*()][\w-.#!?,%$&^*()]+[^-.#!?,%$&^*()]@([\w-]+\.)+[\w-.][^-.,!?#$]{1,4}$/, // обязательно наличие точки и @, минимум 2 символа до @, может содержать знаки, но не в начале или в конце
    ),
  password: Joi.string()
    .required()
    .pattern(/^[^.-](?=.*[\w\d])([a-zA-Z0-9@$!_,%*\-.#?&]{5,30})$/), // минимум и максимум знаков, отсутствие пробелов, может содержать знаки, но не может начинаться с точки или тире
});

const joiSignUpSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[^\s~!@#$%^&*()][\w\d\s!@#$%^&*()]{3,100}$/)
    .min(3)
    .max(100)
    .required(),
  email: Joi.string()
    .min(10)
    .max(63)
    .required()
    .pattern(
      /^[^-.#!?,%$&^*()][\w-.#!?,%$&^*()]+[^-.#!?,%$&^*()]@([\w-]+\.)+[\w-.][^-.,!?#$]{1,4}$/,
    ),
  password: Joi.string()
    .required()
    .pattern(/^[^.-](?=.*[\w\d])([a-zA-Z0-9@$!_,%*\-.#?&]{5,30})$/),
});

const User = model('user', userSchema);

module.exports = { User, joiSchema, joiSignUpSchema };

// GOOGLE_CLIENT_ID=609794465594-7vn9e4pi8k3iark4pfraj1tfh4tdav6o.apps.googleusercontent.com;
// GOOGLE_CLIENT_SECRET=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;
