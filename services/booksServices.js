const { Book } = require('../models/bookSchema');

// Создает новую книгу
const addBook = async (userId, body) => {
  const newBook = await Book.create({ ...body, owner: userId });
  return newBook;
};

// Получает книги по статусу

const getAllBooks = async (userId, queryString) => {
  const { page = 1, limit, status } = queryString;
  const skip = (page - 1) * limit;

  const query = status ? { owner: userId, status } : { owner: userId };

  if (!limit) {
    const books = await Book.find(query)
      .select('-owner -createdAt -updatedAt')
      .populate({
        path: 'owner',
        select: 'email',
      });
    const going = books.filter(item => item.status === 'going');
    const reading = books.filter(item => item.status === 'reading');
    const already = books.filter(item => item.status === 'already');

    return { going, reading, already };
  }

  const books = await Book.find(query)
    .select('-owner -createdAt -updatedAt')
    .skip(skip)
    .limit(parseInt(limit));

  if (!books.length) {
    throw new Error('Not books');
  }
  const going = books.filter(item => item.status === 'going');
  const reading = books.filter(item => item.status === 'reading');
  const already = books.filter(item => item.status === 'already');

  return { going, reading, already };
};

// Обновляет рецензию
const updateBookReviewById = async (userId, bookId, review, rating) => {
  const updatedBook = await Book.findByIdAndUpdate(
    { _id: bookId, owner: userId },
    { review, rating },
    { new: true },
  ).populate({ path: 'owner', select: 'email' });
  return updatedBook;
};
// Находит книгу по title

const findBookByTitle = async (userId, title) => {
  const book = await Book.findOne({ owner: userId, title });
  return book;
};

// Обновляет cтатус книги
const updateBookStatusById = async (userId, bookId, body) => {
  const updatedBook = await Book.findByIdAndUpdate(
    { _id: bookId, owner: userId },
    { ...body },
    { new: true },
  ).populate({ path: 'owner', select: 'email' });
  return updatedBook;
};
// Находит книгу в базе по id
const findBookById = async id => {
  const book = await Book.findById(id);
  return book;
};

// Находит книгу в базе по полю owner и полю status
const findBookByOwnerAndStatus = async (userId, status) => {
  const book = await Book.findOne({ owner: userId, status });
  return book;
};

// Находит книги в базе по полю owner и массиву id
const findBooksbyBookIdsArray = async (userId, bookIdsArray) => {
  const books = await Book.find({ owner: userId, _id: { $in: bookIdsArray } });
  return books;
};

// Находит книги в базе по полю owner и массиву id  и изменяет статус книг
const changeBooksStatus = async (userId, bookIdsArray, status) => {
  await Book.find({
    owner: userId,
    _id: { $in: bookIdsArray },
  }).updateMany({ status });
};

// Удаляет книгу
const removeBook = async (userId, bookId) => {
  const book = await Book.findByIdAndRemove({
    _id: bookId,
    owner: userId,
  });
  return book;
};

module.exports = {
  addBook,
  getAllBooks,
  findBookById,
  updateBookReviewById,
  updateBookStatusById,
  findBookByTitle,
  findBookByOwnerAndStatus,
  findBooksbyBookIdsArray,
  changeBooksStatus,
  removeBook,
};
