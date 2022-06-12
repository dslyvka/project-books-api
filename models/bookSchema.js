const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

const booksSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title '],
      minlength: [1, 'Too short title '],
      maxlength: [50, 'Too long title '],
      match: [
        /^[^-\s]([a-zа-яА-ЯA-Z0-9@$!_\s,%*\-.#?&]{1,50})$/,
        'Please fill a valid title',
      ],
    },
    author: {
      type: String,
      required: [true, 'Set author '],
      minlength: [1, 'Too short author '],
      maxlength: [50, 'Too long author '],
      match: [
        /^[^-\s]([a-zа-яА-ЯA-Z@$!_\s,%*\-.#?&]{1,50})$/,
        'Please fill a valid author',
      ],
    },
    year: {
      type: String,
      required: true,
      maxlength: [4, 'Set correct year'],
      match: [/^[^03456789]([0-9]{1,4})$/, 'Please fill a valid year'],
    },
    pages: {
      type: String,
      required: true,
      maxlength: [4, 'Set correct quantity of pages'],
      match: [/^([0-9]{1,4})$/, 'Please fill a valid number of pages'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      minlength: [1, 'Too short review '],
      maxlength: [1000, 'Too long review '],
      default: null,
    },
    status: {
      type: String,
      enum: ['already', 'reading', 'going'],
      default: 'going',
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const Book = model('book', booksSchema);

//  Схема валидации создания контакта
const addBookJoiSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[^-\s]([a-zа-яА-ЯA-Z0-9@$!_\s,%*\-.#?&]{1,50})$/)
    .min(1)
    .max(50)
    .required(),
  author: Joi.string()
    .pattern(/^[^-\s]([a-zа-яА-ЯA-Z@$!_\s,%*\-.#?&]{1,50})$/)
    .min(1)
    .max(50)
    .required(),
  year: Joi.string()
    .pattern(/^[^03456789]([0-9]{1,4})$/)
    .min(1)
    .max(4)
    .required(),
  pages: Joi.string()
    .pattern(/^([0-9]{1,4})$/)
    .max(4)
    .required(),
  status: Joi.string().valueOf('already', 'reading', 'going'),
});

const bookReviewJoiSchema = Joi.object({
  rating: Joi.string().max(5).required(),
  review: Joi.string().min(2).max(1000),
});
const bookStatusJoiSchema = Joi.object({
  status: Joi.string().valueOf('already', 'reading', 'going').required(),
});

module.exports = {
  Book,
  addBookJoiSchema,
  bookReviewJoiSchema,
  bookStatusJoiSchema,
};
