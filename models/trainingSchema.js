const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

const statisticSchema = new Schema(
  {
    statisticDate: {
      type: Date,
      default: new Date(),
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
      type: Array,
      required: [true, 'Books are required'],
    },

    status: {
      type: String,
      enum: ['active', 'done', 'canceled'],
      default: 'active',
    },

    statistics: {
      type: [statisticSchema],
      required: [true, 'results is required'],
    },

    bookNumber: {
      type: Number,
      default: 0,
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

const statistic = Joi.object({
  statisticDate: Joi.date().required(),
  statisticResult: Joi.number(),
});

const trainingJoiSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  books: Joi.array(),
  status: Joi.string().valueOf('active', 'done'),
  statistics: Joi.array().items(statistic),
});
const addReadedPagesJoiSchema = Joi.object({
  readedPages: Joi.number().min(1).required(),
});
const updateStatisticTrainingJoiSchema = Joi.object({
  statisticDate: Joi.date(),
  statisticResult: Joi.number().min(1).required(),
});

const Training = model('training', trainingSchema);

module.exports = {
  Training,
  trainingJoiSchema,
  addReadedPagesJoiSchema,
  updateStatisticTrainingJoiSchema,
};
