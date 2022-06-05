const express = require('express');
const router = express.Router();

const tryCatchMiddleware = require('../../middlewares/tryCatch');
const validation = require('../../middlewares/validation');
const { addBooks, getBooks } = require('../../controllers/book');
const auth = require('../../middlewares/auth');
const { addBookJoiSchema } = require('../../models/bookSchema');

// Роут для создания книги
router.post(
  '/',
  auth,
  validation(addBookJoiSchema),
  tryCatchMiddleware(addBooks),
);
// Роут для списка всех книг
router.get('/', auth, tryCatchMiddleware(getBooks));

// Роут для создания отзывы
// router.post(
//   '/review',
//   auth,
//   validation(bookReviewJoiSchema),
//   tryCatchMiddleware(booksReview),
// );
module.exports = router;
