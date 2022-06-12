const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

const booksSchema = Schema(
  {
    id: {
      type: SchemaTypes.ObjectId,
      required: [true, "Book's id is required"],
    },
    pages: {
      type: Number,
      required: [true, "Book's pages are required"],
    },
    status: {
      type: String,
      enum: ['already', 'reading', 'going'],
      default: 'going',
    },
  },
  { versionKey: false, _id: false },
);

const trainingSchema = Schema(
  {
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
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
      required: [true],
    },
    books: {
      type: [booksSchema],
      required: [true, 'Books are required'],
    },

    status: {
      type: String,
      enum: ['active', 'done'],
      default: 'active',
    },
    
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);



const books = Joi.object({
  id: Joi.string().required(),
  pages: Joi.number().min(1).required(),
});

const trainingJoiSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  books: Joi.array().items(books),
  status: Joi.string().valueOf('active', 'done'),
 
});
const addReadedPagesJoiSchema = Joi.object({
  readedPages: Joi.number().min(1).required(),
});

const Training = model('training', trainingSchema);

module.exports = { Training, trainingJoiSchema, addReadedPagesJoiSchema };
