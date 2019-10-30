const sinon = require('sinon');

const { moviesMock, filteredMoviesMocks } = require('./movies');

const getAllStub = sinon.stub();
// Aqui le indicamos que cuando se mande el atributo movies resuelva con los mocks
getAllStub.withArgs('movies').resolves(moviesMock);

const tagQuery = { tags: {$in: ['Drama'] } };
// Aqui le indicamos que cuando se mande movies con los tags Drama, resuelva con la version filtrada por drama de mock
getAllStub.withArgs('movies', tagQuery).resolves(filteredMoviesMocks('Drama'));

// Aqui se va a resolver cuando simulemos que estamos creando una pelicula, por lo cual unicamente devolveremos el id de la primera pelicula del mock
const createStub = sinon.stub().resolves(moviesMock[0].id);

class MongoLibMock {
  getAll(collection, query) {
    return getAllStub(collection, query);
  }

  create(collection, data) {
    return createStub(collection, data);
  }
}

module.exports = {
  getAllStub,
  createStub,
  MongoLibMock
}