const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = Schema(
  {
    // Имя пользователя может содержать в себе пробелы
    // Имя пользователя может начинаться только с буквы или цифры
    // Имя пользователя может содержать от 3 до 100 знаков включительно
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Too short name'],
      maxlength: [100, 'Too long name'],
    },
    // Поле имеет обязательно содержать знак "@" / "точку"
    // Минимальное количество символов в поле - 10 (включительно), Максимальное количество символов в поле - 63 (включительно)
    // Перед символом "@" должено стоять минимум 2 символа
    // Поле может содержать дефисы, причем дефис не может находиться в начале или в конце Emaile
    // Поле Emaile пользователя может включать в себя латиницу, цифры, знаки
    // Настроить индексы в базе.
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Please fill a valid email address',
      ],
      minlength: [10, 'Too short email'],
      maxlength: [63, 'Too long email'],
      unique: true,
    },
    //  Поле Password не может начинаться дефисом или точкой
    // Поле Password не может содержать пробелы
    // Поле Password может содержать от 5 до 30 символов (включительно)
    password: {
      type: String,
      trim: true,
      required: [true, 'Set password for user'],
      minlength: [5, 'Too short password'],
      maxlength: [30, 'Too long password'],
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

const signupJoiSchema = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string()
    .min(10)
    .max(63)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ua', 'ru', 'gov', 'ca'] },
    })
    .required()
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
const loginJoiSchema = Joi.object({
  email: Joi.string()
    .min(10)
    .max(63)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ua', 'ru', 'gov', 'ca'] },
    })
    .required()
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

const User = model('user', userSchema);

module.exports = { User, signupJoiSchema, loginJoiSchema };
