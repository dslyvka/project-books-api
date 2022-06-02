const mongoose = require('mongoose');
const process = require('process');
const app = require('./app');

const { PORT = 3001 } = process.env;
const { DB_HOST } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log(
        `Database connection successful.Use our API on port: ${PORT}.`,
      );
    }),
  )
  .catch(error => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  });
