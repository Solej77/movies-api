/**
 * Este sirvicio nos va a permitir que apartir de un API Token podamos obtener los scopes (permisos), que es requerido a la
 * hora de firmar el JSON Web Token con los Scopes correspondientes de acuerdo al API Token que nosotros enviemos 
 */
const MongoLib = require('../lib/mongo');

class ApiKeysServices {
  constructor() {
    this.collection = 'api-keys';
    this.mongoDB = new MongoLib(); 
  }

  //Obtenemos los Scopes(permisos) acorde al Token que enviemos
  async getApiKey({ token }) {
    const [apiKey] = await this.mongoDB.getAll(this.collection, { token });
    return apiKey;
  }
}

module.exports = ApiKeysServices;
