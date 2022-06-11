const { Training } = require('../models/trainingSchema');

const addTraining = async (userId, body) => {
  const { startDate: statisticDate, books } = body;
  const totalPages = books.reduce((acc, book) => acc + book.pages, 0);
  const newTrainig = await Training.create({
    ...body,
    totalPages,
    readedPages: 0,
    results: [{ statisticDate, statisticResult: 0 }],
    owner: userId,
  });

  return newTrainig;
};

const getTraining = async userId => {
  const trainings = await Training.find({ owner: userId });
  return trainings;
};

module.exports = { addTraining, getTraining };
