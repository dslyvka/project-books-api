const { Training } = require('../models/trainingSchema');

const addTraining = async (userId, body) => {
  const { startDate, books } = body;
  const totalPages = books.reduce((acc, book) => acc + book.pages, 0);
  const newTrainig = await Training.create({
    ...body,
    readedPages: 0,
    results: [{ startDate, totalPages }],
    owner: userId,
  });

  return newTrainig;
};

module.exports = { addTraining };
