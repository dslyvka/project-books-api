const { Book } = require('../models/bookSchema');

// Создает новую книгу
const addBook = async (userId, body) => {
  const newBook = await Book.create({ ...body, owner: userId });
  return newBook;
};

// Получает все книги

const getAllBooks = async (userId, queryString) => {
  const { page = 1, limit = 5, status, sort } = queryString;
  const skip = (page - 1) * limit;

  const query = status ? { owner: userId, status } : { owner: userId };

  const books = await Book.find(query)
    .select('-owner -createdAt -updatedAt')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ sort });
  return books;
};
// Создает рецензию
const addReview = async (userId, body) => {
  const newReview = await Book.create({ ...body, owner: userId });
  return newReview;
};

module.exports = { addBook, addReview, getAllBooks };
