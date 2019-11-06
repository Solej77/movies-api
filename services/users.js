const MongoLib = require('../lib/mongo');
// Nos ayuda a crear password en modod hash
const bcrypt = require('bcrypt');

class UserServices {
  constructor() {
    // Se guarda la coleccion de users
    this.collection = 'users',
    // Es de donde vamos a obtener la collection en este caso es de Mongo
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [ user ] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async createUser({ user }) {
    const { name, email, password } = user;
    // Crear password encriptado
    const hashedPassword = await bcrypt(password, 10);

    const createUserId = await this.mongoDB.create(this.collection, {
      name,
      email,
      password: hashedPassword
    });

    return createUserId;
  }
}

module.exports = UserServices;
