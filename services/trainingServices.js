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



const updateReadedPages = async (userId, trainingId, readedPages) => {
  const updatedReadedPages = await Training.findByIdAndUpdate(
    { _id: trainingId, owner: userId },
    { readedPages },
    { new: true },
  ).populate({ path: 'owner', select: 'email' });
  return updatedReadedPages;
};

// Находит тренировку в базе по id
const findTrainingById = async id => {
  const training = await Training.findById(id);
  return training;
};
// Находит тренировку в базе по полю owner и полю status
const findTrainingByOwnerAndStatus = async (userId, status) => {
  const training = await Training.findOne({ owner: userId, status });
  return training;
};
module.exports = {
  addTraining,
  updateReadedPages,
  getTraining, 
  findTrainingById,
  findTrainingByOwnerAndStatus,
};

