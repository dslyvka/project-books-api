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
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      min: [10, 'Too short email'],
      max: [63, 'Too long email'],
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
  name: Joi.string().min(4).max(100),
  email: Joi.string()
    .min(10)
    .max(63)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ua', 'ru', 'gov', 'ca'] },
    })
    .pattern(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    )
    .required(),
  password: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{5,})\S$/)
    .required(),
});

const joiSignUpSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9а-яА-ЯёЁ]+(?:\s+[a-zA-Z0-9-а-яА-ЯЁё]+){1,2}$/)
    .min(3)
    .max(100)
    .required(),
  email: Joi.string()
    .min(10)
    .max(63)
    .required()
    .pattern(
      /^[^-.#!?,%$&^*()][\w-.#!?,%$&^*()]{2,}@([\w-]+\.)+[\w-.][^-.,!?#$]{1,4}$/,
    ),
  password: Joi.string()
    .required()
    .pattern(/^[^.-](?=.*[\w\d])([a-zA-Z0-9@$!._,%*\-#?&]{5,30})$/),
});

const User = model('user', userSchema);

module.exports = { User, joiSchema, joiSignUpSchema };
