const { MongoClient, ObjectId } = require("mongodb");
const { config } = require("../config");

/**
 * encodeURIComponent, nos ayuda a garantizar que algunos caracteres especiales
 * no tengamos problemas para conectarnos
 */
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = encodeURIComponent(config.dbName);

const MONGO_URI = `mongodb+srv://'${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  /**
   * En el connect se va a implentar el patron singleton, para evitar que se creen varias instancias de conexiones
   */
  connect() {
    if (!MongoLib.connection) {
      /**
       * MongoLib.connection, connection al no estar declarado en el constructo se considera como un atributo estatico
       */
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }

          // eslint-disable-next-line no-console
          console.log("Connected succesfully to mongo");
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connection().then(db => {
      // con el return estamos garantizando un manejo asincrono
      return db
        .collection(collection)
        .find(query)
        .toArray();
    });
  }

  get(collection, id) {
    return this.connection().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connection()
      .then(db => {
        return db.collection(collection).insertOne(data);
      })
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connection()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connection()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
