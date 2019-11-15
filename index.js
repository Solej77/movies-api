const express = require("express");
const helmet = require("helmet");
const app = express();
const debug = require("debug")("app:server");

const { config } = require("./config/index");
const authApi = require('./routes/auth');
const moviesApi = require("./routes/movies.js");
const userMoviesApi = require("./routes/userMovies.js");

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require("./utils/middleware/errorHandlers.js");

const notFoundHandler = require("./utils/middleware/notFoundHandler.js");

app.use(express.json()); // middleware body parser
// Si quisieramos establecer parametros extras, lo unico que debmos hacer es psar
// las configuraciones 
app.use(helmet());

// routes
authApi(app);
moviesApi(app);
userMoviesApi(app);

// Catch 404
app.use(notFoundHandler);

//Erros middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function() {
  // eslint-disable-next-line no-console
  debug(`Listening http://localhost:${config.port}`);
});
