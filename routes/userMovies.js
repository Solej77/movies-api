//crear el server
const express = require("express");

//Importamos Passport
const passport = require("passport");

// capa de negocio
const UserMoviesService = require("../services/userMovies");

// helper
const validationHandler = require("../utils/middleware/validationHandler");

// Validación de Scopes
const scopesValidationHandler = require("../utils/middleware/scopesValidationHandler");

//Schema's para validaro los endpoints
const { movieIdSchema } = require("../utils/schemas/movies");
const { userIdSchema } = require("../utils/schemas/users");
const { createUserMovieSchema } = require("../utils/schemas/userMovies");

//JWT Strategy
require("../utils/auth/strategies/jwt");

// Con este atributos protegemos nuestras rutas passport.authenticate('jwt',{session:false})

// Definicion de las rutas del usuario
function userMoviesApi(app) {
  //Definicion de la ruta de la API de usuarios
  const router = express.Router();
  app.use("/api/user-movies", router);

  const userMoviesService = new UserMoviesService();

  // enpoint para obtener todas las peliculas del usuario
  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(['read:user-movies']),
    validationHandler({ userId: userIdSchema }, "query"),
    async function(req, res, next) {
      const { userId } = req.query;

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: "user movies listed"
        });
      } catch (err) {
        // como es una funcion asncrona, la manera de mandar a llamar un error es mendiante el next
        next(err);
      }
    }
  );

  // endpoint para agregar una pelicula a la lista de favoritos
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(['create:user-movies']),
    validationHandler(createUserMovieSchema),
    async function(req, res, next) {
      // obtenemos del body el id del usuario y el id de la pelicula (userMovie)
      const { body: userMovie } = req;

      try {
        const createdUserMovieId = await userMoviesService.createUserMovie({
          userMovie
        });

        res.status(201).json({
          data: createdUserMovieId,
          message: "user movie created"
        });
      } catch (err) {
        next(err);
      }
    }
  );

  // endpoint para eliminar una pelicula de la lista de favoritos del usuario
  router.delete(
    "/:userMovieId",
    passport.authenticate("jwt", { session: false }),
    scopesValidationHandler(['delete:user-movies']),
    validationHandler({ userMovieId: movieIdSchema }, "params"),
    async function(req, res, next) {
      const { userMovieId } = req.params;

      try {
        const deletedUserMovieId = await userMoviesService.deleteUserMovie({
          userMovieId
        });

        res.status(200).json({
          data: deletedUserMovieId,
          message: "user movie deleted"
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = userMoviesApi;
