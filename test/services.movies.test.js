// libreria ssert es nativa de nodejs
const assert = require("assert");

// para poder intercambiar la libreria de mongo por nuestro mock, para la simulacion de respuesta
const proxyquire = require("proxyquire");

// traer los mocks
const { getAllStub, MongoLibMock } = require("../utils/mocks/mongoLib");
const { moviesMock } = require("../utils/mocks/movies");

// definición del test
describe("services - movies", function() {
  // Remplazar los servicios de mongo por nuestro mock
  const MoviesServices = proxyquire("../services/movies", {
    "../lib/mongo": MongoLibMock
  });

  // Crear instancia de este servicio
  const moviesServices = new MoviesServices();

  describe("when getMovies method id called", async function() {
    // comprobar que el primer metodo se llame en la libreria
    it("should call the getall MongoLib method", async function() {
      await moviesServices.getMovies({});
      assert.strictEqual(getAllStub.called, true);
    });


    // validacion de que retorne la coleccion de peliculas
    it("should return an array of movies", async function() {
      const result = await moviesServices.getMovies({});
      const expected = moviesMock;
      assert.deepEqual(result, expected);
    });
  });
});
