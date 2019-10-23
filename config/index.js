/* Con este archivo abstraemos las variables de entorno,  para cuando el dia de mañana si las obtenemos de otra manera, 
solo modificamos el como lo hacemos dentro de este archivo, ya que las varaibles permanecen
*/
require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  cors: process.env.CORS,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME
};

module.exports = { config };