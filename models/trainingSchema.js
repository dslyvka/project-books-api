const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

const booksSchema = Schema(
  {
    id: {
      type: SchemaTypes.ObjectId,
      required: [true, 'Book id is required'],
    },
    pages: {
      type: Number,
      required: [true, 'Book pages is required'],
    },
    status: {
      type: String,
      enum: ['already', 'reading', 'going'],
      default: 'going',
    },
  },
  { _id: false },
);
const trainingSchema = Schema(
  {
    startDate: {
      type: Date,
      required: [true, 'Start Date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End Date is required'],
    },
    readedPages: {
      type: Number,
      required: [true],
    },
    totalPages: {
      type: Number,
      required: [true, 'Total pages is required'],
    },
    books: {
      type: [booksSchema],
      required: [true, 'Books array is required'],
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
);

const books = Joi.object({
  id: Joi.string().required(),
  pages: Joi.number().min(1).required(),
});

const trainingJoiSchema = Joi.object({
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().required(),
  books: Joi.array().items(books),
});

const Training = model('training', trainingSchema);

module.exports = { Training, trainingJoiSchema };
