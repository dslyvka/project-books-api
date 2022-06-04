const { addBook } = require('../services/booksServices');

// Создание контакта
// title;
// autor;
// year;
//  pages;
const addBooks = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  if (!body.title && !body.autor && !body.year && !body.pages) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  const book = await addBook(userId, body);
  res.status(201).json({ book, status: 'success' });
};

module.exports = { addBooks };
