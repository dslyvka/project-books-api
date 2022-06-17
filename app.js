const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
dotenv.config();

const authRouter = require('./routes/API/auth');
const booksRouter = require('./routes/API/books');
const googleAuthRouter = require('./routes/API/auth');
const trainingsRouter = require('./routes/API/trainings');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors({ origin: "https://project-books.netlify.app/", credentials: true }));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', authRouter);
app.use('/auth', googleAuthRouter);
app.use('/api/books', booksRouter);
app.use('/api/trainings', trainingsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
