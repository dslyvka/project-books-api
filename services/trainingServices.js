const { Training } = require('../models/trainingSchema');
const {
  changeBooksStatus,
  findBooksbyBookIdsArray,
} = require('./booksServices');

const addTraining = async (userId, body) => {
  const { startDate: statisticDate, books } = body;

  const bookIdsArray = books.map(book => book.id);

  if (bookIdsArray.length) {
    await changeBooksStatus(userId, bookIdsArray, 'reading');
  }

  const booksFromBookIdsArray = await findBooksbyBookIdsArray(
    userId,
    bookIdsArray,
  );
  const totalPages = booksFromBookIdsArray.reduce(
    (acc, book) => acc + Number(book.pages),
    0,
  );
  await changeBooksStatus(userId, bookIdsArray, 'reading');

  const newTrainig = await Training.create({
    ...body,
    books: [...booksFromBookIdsArray],
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

  const { books, totalPages, statistics, readedPages, endDate } = training;

  const updatedReadedPages = readedPages + statisticResult;
  statistics.push({ statisticDate, statisticResult });

  if (
    endDate.getTime() <
    statistics[statistics.length - 1].statisticDate.getTime()
  ) {
    const bookIdsArray = [];
    books.map(book => {
      if (book.status === 'reading') {
        bookIdsArray.push(book._id);
      }
      console.log(bookIdsArray);
      return bookIdsArray;
    });
    if (bookIdsArray.length) {
      await changeBooksStatus(userId, bookIdsArray, 'going');
    }
    console.log(userId);
    const booksFromBookIdsArray = await findBooksbyBookIdsArray(
      userId,
      bookIdsArray,
    );
    const failedTraining = await Training.findOneAndUpdate(
      { owner: userId, status: 'active' },
      {
        readedPages: statisticResult,
        status: 'canceled',
        statistics,
        books: [...booksFromBookIdsArray],
      },
      { new: true },
    );
    return failedTraining;
  }

  if (updatedReadedPages >= totalPages) {
    const bookIds = [];

    if (updatedReadedPages >= totalPages) {
      books.map(book => {
        if (book.status === 'reading') {
          bookIds.push(book._id);
        }
        return bookIds;
      });
    }

    if (bookIds.length) {
      await changeBooksStatus(userId, bookIds, 'already');
    }
    const booksFromBookIdsArray = await findBooksbyBookIdsArray(
      userId,
      bookIds,
    );

    const doneTraining = await Training.findOneAndUpdate(
      { owner: userId, status: 'active' },
      {
        readedPages: totalPages,
        status: 'done',
        statistics,
        books: [...booksFromBookIdsArray],
      },
      { new: true },
    );
    return doneTraining;
  }

  const updatedTraining = await Training.findOneAndUpdate(
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
