const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
// const gravatar = require('gravatar');

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 4,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Please fill a valid email address',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: 6,
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
// userSchema.methods.createToken = function () {
//   const { SECRET_KEY } = process.env;
//   const payload = {
//     _id: this._id,
//   };
//   return jwt.sign(payload, SECRET_KEY);
// };

const joiSchema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const User = model('user', userSchema);

module.exports = { User, joiSchema };
