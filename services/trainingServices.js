const { Training } = require('../models/trainingSchema');

const addTraining = async (userId, body) => {
  const { startDate: statisticDate, books } = body;
  const totalPages = books.reduce((acc, book) => acc + book.pages, 0);
  const newTrainig = await Training.create({
    ...body,
    totalPages,
    readedPages: 0,
    statistics: [{ statisticDate, statisticResult: 0 }],
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
// Обновление стистики тренировки
const updateStatistic = async (userId, statisticDate, statisticResult) => {
  const training = await findTrainingByOwnerAndStatus(userId, 'active');
  if (!training) throw new Error('Training not Found');

  const { totalPages, statistics, readedPages } = training;
  const updatedReadedPages = readedPages + statisticResult;
  statistics.push({ statisticDate, statisticResult });

  if (updatedReadedPages >= totalPages) {
    const doneTraining = await Training.findOneAndUpdate(
      { owner: userId, status: 'active' },
      {
        readedPages: totalPages,
        status: 'done',
        statistics,
      },
      { new: true },
    );
    return doneTraining;
  }

  const updatedTraining = Training.findOneAndUpdate(
    { owner: userId, status: 'active' },
    { readedPages: updatedReadedPages, statistics },
    { new: true },
  );

  return updatedTraining;
};

module.exports = {
  addTraining,
  updateReadedPages,
  getTraining,
  findTrainingById,
  findTrainingByOwnerAndStatus,
  updateStatistic,
};
