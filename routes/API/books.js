const express = require('express');

const tryCatchMiddleware = require('../../middlewares/tryCatch');
const { addBooks } = require('../../controllers/book');
const auth = require('../../middlewares/auth');
const { addBookJoiSchema } = require('../../models/bookSchema');

const router = express.Router();
router.post('/', auth, addBookJoiSchema, tryCatchMiddleware(addBooks)); // Роут для создания контакта
module.exports = router;
