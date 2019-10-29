const joi = require("@hapi/joi");

/**
 * Con regex validamos los id que se van generando dentro de Mongo, mediante expresiones regulares
 */
const movieIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const movieTitleSchema = joi.string().max(80);
const movieYearSchema = joi
  .number()
  .min(1888)
  .max(2077);
const movieCoverSchema = joi.string().uri();
const movieDescriptionScheme = joi.string().max(300);
const movieDurationSchema = joi
  .number()
  .min(1)
  .max(300);
const movieContentRatingSchema = joi.string().max(5);
const movieSourceSchema = joi.string().uri();
const movieTagsSchema = joi.array().items(joi.string().max(50));

// Con la funcón required(), estamos indicando que ese dato es requerio
const createMovieSchema = {
  title: movieTitleSchema.required(),
  year: movieYearSchema.required(),
  cover: movieCoverSchema.required(),
  description: movieDescriptionScheme.required(),
  duration: movieDurationSchema.required(),
  contentRating: movieContentRatingSchema.required(),
  source: movieSourceSchema.required(),
  tags: movieTagsSchema
};

const updateMovieSchema = {
  title: movieTitleSchema,
  year: movieYearSchema,
  cover: movieCoverSchema,
  description: movieDescriptionScheme,
  duration: movieDurationSchema,
  contentRating: movieContentRatingSchema,
  source: movieSourceSchema,
  tags: movieTagsSchema
};

module.exports = {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
};
