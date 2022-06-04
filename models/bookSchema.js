const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

const booksSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title '],
      minlength: [1, 'Too short title '],
      maxlength: [60, 'Too long title '],
    },
    autor: {
      type: String,
      required: [true, 'Set autor '],
      minlength: [1, 'Too short autor '],
      maxlength: [50, 'Too long autor '],
    },
    year: {
      type: String,
      required: true,
      maxlength: [4, 'Set correct year'],
    },
    pages: {
      type: String,
      required: true,
      maxlength: [4, 'Set correct quantity of pages'],
    },
    rating: {
      type: Number,
      max: 5,
    },
    review: {
      type: String,
      minlength: [2, 'Too short review '],
      maxlength: [1000, 'Too long review '],
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
  title: Joi.string().alphanum().min(1).max(60).required(),
  autor: Joi.string().alphanum().min(1).max(50).required(),
  year: Joi.string().min(1).max(4).required(),
  pages: Joi.string().max(4).required(),
  // rating: Joi.number().max(5),
  // review: Joi.string().min(2).max(1000),
  // status: Joi.string().valueOf('already', 'reading', 'going'),
});

module.exports = { Book, addBookJoiSchema };
