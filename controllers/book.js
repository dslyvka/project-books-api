const {
  addBook,
  getAllBooks,
  updateBookReviewById,
  updateBookStatusById,
  findBookByTitle,
  removeBook,
} = require('../services/booksServices');

// Создание книг
const addBooks = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;



  if (!body.title && !body.author && !body.year && !body.pages) {

    return res.status(400).json({ message: 'missing required name field' });
  }
  const result = await findBookByTitle(userId, body.title);

  if (result) {
    return res.status(409).json({ message: 'book already exists' });
  }

  const book = await addBook(userId, body);
  res.status(201).json({ book, status: 'success' });
};

// Получение книг по статусу
const getBooks = async (req, res) => {
  const userId = req.user._id;
  const query = req.query;

  const books = await getAllBooks(userId, query);
  res.status(200).json({ books, status: 'success' });
};

// Создание рецензии
const booksReview = async (req, res) => {
  const { bookId } = req.params;
  const { review, rating } = req.body;
  const userId = req.user._id;

  if (!rating) {
    return res.status(400).json({ message: 'missing required field  rating' });
  }
  const book = await updateBookReviewById(userId, bookId, review, rating);
  if (!book) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ book, status: 'success' });
};

// Обновляет cтатус книги
const updateBookStatus = async (req, res) => {
  const { bookId } = req.params;
  const body = req.body;
  const userId = req.user._id;

  if (!body) {
    return res.status(400).json({ message: 'missing field  status' });
  }
  const book = await updateBookStatusById(userId, bookId, body);
  if (!book) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ book, status: 'success' });
};

// Удаляет книгу
const deleteBook = async (res, req) => {
  const { bookId } = req.params;
  const userId = req.user._id;
  const result = await removeBook(userId, bookId);
  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ result, message: 'book deleted' });
};
module.exports = {
  addBooks,
  booksReview,
  getBooks,
  updateBookStatus,
  deleteBook,
};
