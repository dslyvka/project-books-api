const {
  addBook,
  addReview,
  getAllBooks,
} = require('../services/booksServices');

// Создание книг

const addBooks = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  if (!body.title && !body.autor && !body.year && !body.pages) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  const book = await addBook(userId, body);
  res.status(201).json({ book, status: 'success' });
};

// Получение всех книг

const getBooks = async (req, res) => {
  const userId = req.user._id;
  const query = req.query;

  const books = await getAllBooks(userId, query);
  res.status(200).json({ books, status: 'success' });
};

// Создание рецензии
const booksReview = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  if (!body.review && !body.rating) {
    return res.status(400).json({ message: 'leave out the review' });
  }
  const review = await addReview(userId, body);
  res.status(201).json({ review, status: 'success' });
};

module.exports = { addBooks, booksReview, getBooks };
