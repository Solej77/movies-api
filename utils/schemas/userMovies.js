// libreria que nos va ayudar a validar que los datos que vienen de los end points tengan el formato correcto
const joi = require("@hapi/joi");

const { movieIdSchema } = require("./movies");
const { userIdSchema } = require("./users");

// Schema(validacion)
const userMovieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserMovieSchema = {
  userId: userIdSchema,
  movieId: movieIdSchema
};

module.exports = {
  userMovieIdSchema,
  createUserMovieSchema
};
