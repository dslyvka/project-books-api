const { Book } = require('../models/bookSchema');

// Создает новую книгу
const addBook = async (userId, body) => {
  const newBook = await Book.create({ ...body, owner: userId });
  return newBook;
};

module.exports = { addBook };
