const { Book } = require('../models/bookSchema');

// Создает новую книгу
const addBook = async (userId, body) => {
  const newBook = await Book.create({ ...body, owner: userId });
  return newBook;
};

// Получает книги по статусу

const getAllBooks = async (userId, queryString) => {
  const { page = 1, limit = 5, status } = queryString;
  const skip = (page - 1) * limit;

  const query = status ? { owner: userId, status } : { owner: userId };

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

// Обновляет cтатус книги
const updateBookStatusById = async (userId, bookId, body) => {
  const updatedBook = await Book.findByIdAndUpdate(
    { _id: bookId, owner: userId },
    { ...body },
    { new: true },
  ).populate({ path: 'owner', select: 'email' });
  return updatedBook;
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
  updateBookReviewById,
  updateBookStatusById,
  removeBook,
};
