/**
 * Es el encargado de verificar si es verdad o no la comparacion de los tests
 */
const assert = require('assert');

// cada vez que se realice un requiere, en vez de mandar un paquete real, mandamos un mock
const proxyquiere = require('proxyquire');


const { moviesMock , MoviesServiceMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');


/**
 * Aqui es como escribimos los test
 * con la palabra describe es lo que se va a imprimir en la consola
 */
describe('routes - movies', function() {
  // con esto indicamos que se realice el intercambio por los mocks
  const route = proxyquiere('../routes/movies', {
    '../services/movies': MoviesServiceMock
  });

  const request = testServer(route);
  describe('GET /movies', function() {

    it('should responde with status 200', function(done) {
      request.get('/api/movies').expect(200, done);
    });

    it('should respond with the list of movies', function(done) {
      request.get('/api/movies').end((err, res) => {
        //deepEqual es para comparar objetos
        assert.deepEqual(res.body, {
          data: moviesMock,
          message: 'movies listed'
        });

        done();
      });
    });
  });
});