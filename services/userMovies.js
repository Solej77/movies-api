const MongoLib = require("../lib/mongo");

class UserMoviesService {
  constructor() {
    // Coleccion de Mongo
    (this.collection = "user-movies"),
      // nueva Instancia del cliente de Mongo, ya que el archivo de la libreria de mongo esta especificado como una clase  //const MongoLib = require('../lib/mongo');
      (this.mongoDB = new MongoLib());
  }

  // Obtener las peliculas del usuario atarvez del id del usuario
  async getUserMovies({ userId }) {
    const query = userId && { userId };
    const userMovies = await this.mongoDB.getAll(this.collection, query);

    return userMovies || [];
  }

  // agregar una pelicula a la lista de favoritos al usuario
  async createUserMovie({ userMovie }) {
    const createUserMovieId = await this.mongoDB.create(
      this.collection,
      userMovie
    );

    return createUserMovieId;
  }

  // eliminar una pelicula de su lista de favoritos del usuario
  async deleteUserMovie({ userMovieId }) {
    const deleteUserMovieId = await this.mongoDB.delete(
      this.collection,
      userMovieId
    );

    return deleteUserMovieId;
  }
}

module.exports = UserMoviesService;
