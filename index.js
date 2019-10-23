const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies.js');

const {
  logErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers.js');

app.use(express.json()); // middleware body parser

moviesApi(app);

app.use(logErrors);
app.use(errorHandler);

app.listen(config.port, function() {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${config.port}`);
});
