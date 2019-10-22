/**
 * La unica responsabilidad de las rutas es como recibir los parametros,
 * para que posteriormente puedan ser enviados a los servicios
 */

const express = require('express');
// importar la capa de servicios
const MoviesService = require('../services/movies');


function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  // Instanciamos los servicios
  const moviesService = new MoviesService();

  router.get('/', async function(req, res, next) {
    //Se obtiene de la lestura de la Request y Response Object
    const { tags } = req.query;

    try {
      const movies = await moviesService.getMovies({ tags });
      res.status(200).json({
        data: movies,
        message: 'movies listed'
      });
      
    } catch (error) {
      next(error);
    }
  });

  router.get('/:movieId', async function(req, res, next) {
    
    /**
     * ¿En que casos utilxar req.query y req.params?
     * 
     * req.query = es cuando utilizamos el signo de ? nombre de query y se puede concatenar
     * 
     * req.params = es cuando los datos estan establecidosos en la url
     */
    const { movieId } = req.params;

    try {
      const movies = await moviesService.getMovie({ movieId })
      res.status(200).json({
        data: movies,
        message: 'movie retrieved'
      });
      
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async function(req, res, next) {

    const { body: movie } = req;

    try {
      const createMovieId = await moviesService.createMovie({ movie });
      res.status(201).json({
        data: createMovieId,
        message: 'movies created'
      });
      
    } catch (error) {
      next(error);
    }
  });

  router.put('/:movieId', async function(req, res, next) {
  const { movieId } = req.params;
  const { body: movie } = req;

    try {
      const updatedMoevieId = await moviesService.updateMovie({
        movieId, 
        movie
      });
      res.status(200).json({
        data: updatedMoevieId,
        message: 'movies updated'
      });
      
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:movieId', async function(req, res, next) {
    const { movieId } = req.params;
    try {
      const deletedMoevieId = await moviesService.deleteMovie({ movieId });
      res.status(200).json({
        data: deletedMoevieId,
        message: 'movies deleted'
      });
      
    } catch (error) {
      next(error);
    }
  });
}

module.exports = moviesApi;