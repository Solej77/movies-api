//crear el server
const express = require("express");

// capa de negocio
const UserMoviesService = require("../services/userMovies");

// helper
const validationHandler = require("../utils/middleware/validationHandler");

//Schema's para validaro los endpoints
// const { movieIdSchema } = require("../utils/schemas/movies");
const { userIdSchema } = require("../utils/schemas/users");
// const { cerateUserSchema } = require("../utils/schemas/userMovies");

// Definicion de las rutas del usuario
function userMoviesApi(app) {
  //Definicion de la ruta de la API de usuarios
  const router = express.Router();
  app.user("/api/user-movies", router);

  const userMoviesService = new UserMoviesService();

  router.get(
    "/",
    validationHandler({ userId: userIdSchema }, "query"),
    async function(req, res, next) {
      const { userId } = req.query;

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: "user movies listed"
        });
      } catch (error) {
        // como es una funcion asncrona, la manera de mandar a llamar un error es mendiante el next
        next(error);
      }
    }
  );
}

module.exports = userMoviesApi;
