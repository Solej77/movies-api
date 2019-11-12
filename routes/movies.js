/**
 * La unica responsabilidad de las rutas es como recibir los parametros,
 * para que posteriormente puedan ser enviados a los servicios
 */

const express = require("express");
const passport = require('passport');

// importar la capa de servicios
const MoviesService = require("../services/movies");

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require("../utils/schemas/movies");

const validationHandler = require("../utils/middleware/validationHandler");

// Funcionalidad para saber donde agregar cache
const cacheResponse = require('../utils/cacheResponse');
// tiempos de response
const { 
  FIVE_MINUTES_IN_SECONDS, 
  SIXTY_MINUTES_IN_SECONDS 
} = require('../utils/time');

//JWT Strategy
require('../utils/auth/strategies/jwt');

// Con este atributos protegemos nuestras rutas passport.authenticate('jwt',{session:false})
 

function moviesApi(app) {
  const router = express.Router();
  app.use("/api/movies", router);

  // Instanciamos los servicios
  const moviesService = new MoviesService();

  router.get("/", passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    //Se obtiene de la lestura de la Request y Response Object
    const { tags } = req.query;

    try {
      const movies = await moviesService.getMovies({ tags });

      res.status(200).json({
        data: movies,
        message: "movies listed"
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/:movieId",
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, "params"),
    async function(req, res, next) {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      /**
       * ¿En que casos utilxar req.query y req.params?
       *
       * req.query = es cuando utilizamos el signo de ? nombre de query y se puede concatenar
       *
       * req.params = es cuando los datos estan establecidosos en la url
       */
      const { movieId } = req.params;

      try {
        const movies = await moviesService.getMovie({ movieId });
        res.status(200).json({
          data: movies,
          message: "movie retrieved"
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post("/", passport.authenticate('jwt', { session: false }), validationHandler(createMovieSchema), async function(
    req,
    res,
    next
  ) {
    const { body: movie } = req;

    try {
      const createMovieId = await moviesService.createMovie({ movie });
      res.status(201).json({
        data: createMovieId,
        message: "movies created"
      });
    } catch (error) {
      next(error);
    }
  });

  router.put(
    "/:movieId",
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, "params"),
    validationHandler(updateMovieSchema),
    async function(req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;

      try {
        const updatedMoevieId = await moviesService.updateMovie({
          movieId,
          movie
        });
        res.status(200).json({
          data: updatedMoevieId,
          message: "movies updated"
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // router.patch('/:movieId', async function(req, res, next) {
  //   const { movieId } = req.params;

  //   try {
  //     const updateDataMovieId = await moviesService.updateDataMovie({ movieId });
  //     res.status(200).json({
  //       data: updateDataMovieId,
  //       message: 'data movie updated'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  router.delete(
    "/:movieId",
    passport.authenticate('jwt', { session: false }),
    validationHandler({ movieId: movieIdSchema }, "params"),
    async function(req, res, next) {
      const { movieId } = req.params;
      try {
        const deletedMovieId = await moviesService.deleteMovie({ movieId });
        res.status(200).json({
          data: deletedMovieId,
          message: "movies deleted"
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = moviesApi;
