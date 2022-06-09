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
  { versionKey: false, _id: false },
);
const statisticSchema = new Schema(
  {
    statisticDate: {
      type: Date('dd-MM-yyyy'),
      required: [true, 'Result date is required'],
    },
    statisticResult: {
      type: Number,
      required: [true],
    },
  },
  { versionKey: false, _id: false },
);
const trainingSchema = Schema(
  {
    startDate: {
      type: { type: Date('dd-MM-yyyy'), default: Date.now },
      // required: [true, 'Start Date is required'],
    },
    endDate: {
      type: Date('dd-MM-yyyy'),
      required: [true, 'End Date is required'],
    },
    readedPages: {
      type: Number,
      required: [true],
    },
    totalPages: {
      type: Number,
      required: [true],
    },
    books: {
      type: [booksSchema],
      required: [true, 'Books  is required'],
    },

    status: {
      type: String,
      enum: ['already', 'reading', 'going'],
      default: 'reading',
    },
    results: {
      type: [statisticSchema],
      required: [true, 'results is required'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true },
);

const statistic = Joi.object({
  statisticDate: Joi.date().required(),
  statisticResult: Joi.number(),
});

const books = Joi.object({
  id: Joi.string().required(),
  pages: Joi.number().min(1).required(),
});

const trainingJoiSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  books: Joi.array().items(books),
  status: Joi.string().valueOf('already', 'reading', 'going'),
  results: Joi.array().items(statistic),
});
const addReadedPagesJoiSchema = Joi.object({
  readedPages: Joi.number().min(1).required(),
});

const Training = model('training', trainingSchema);

module.exports = { Training, trainingJoiSchema, addReadedPagesJoiSchema };
