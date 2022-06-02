const { Schema, model, SchemaTypes } = require('mongoose');

const booksSchema = Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title '],
      min: [3, 'Too short title '],
    },
    year: {
      type: String,
      required: true,
      min: [4, 'Set correct year'],
      max: [4, 'Set correct year'],
    },
    pages: {
      type: String,
      required: true,
      max: [5, 'Set correct quantity of pages'],
    },
    rating: {
      type: Number,
      minlength: 1,
      maxlength: 5,
    },
    review: {
      type: String,
      minlength: [15, 'Too short review '],
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
module.exports = Book;
