// En esta capa dejamos la responsabilidad de servir los mocks es de la capa de servicio para tener un código mas reutulizable
const { moviesMock } = require("../utils/mocks/movies");

class MoviesService {
  async getMovies() {
    const movies = await Promise.resolve(moviesMock);
    return movies || [];
  }

  async getMovie() {
    const movie = await Promise.resolve(moviesMock[0]);
    return movie || {};
  }

  async createMovie() {
    const createMovieId = await Promise.resolve(moviesMock[0].id);
    return createMovieId;
  }

  async updateMovie() {
    const updateMovieId = await Promise.resolve(moviesMock[0].id);
    return updateMovieId;
  }

  async updateDataMovie() {
    const updateDataMovieId = await Promise.resolve(moviesMock[0].id);
    return updateDataMovieId;
  }

  async deleteMovie() {
    const deleteMovieId = await Promise.resolve(moviesMock[0].id);
    return deleteMovieId;
  }
}

module.exports = MoviesService;
