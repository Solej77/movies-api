const passport = require('passport');
const { BasicStrategy } = require('passport-http');
// Boom para manejar errores en caso de que algo ocurra
const boom = require("@hapi/boom");
// Sirve para verificar si el password que esta pasando el usuario es correcto con el password que se tiene en el base de datos
const bcrypt = require("bcrypt");

// Encargado de buscar nuetsros usarios dado un query
const UsersService = require("../../../services/users");

// Hacemos uso de la estrategia basica
passport.use(
  new BasicStrategy(async function(email, password, cb) {
    const userService = new UsersService();

    try {
      // Obtenemos los datos del usuario con ayuda de la capa de negocio
      const user = await userService.getUser({ email });

      // Validamos si existe el usuario, de lo contrario  retornamos en el callback un boom
      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      // Validamos si el password es el mismo del que tenemos en base de datos, de lo contrario  retornamos en el callback un boom
      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      // Se elimina el password del usuario para evitar que retornemos ese valor del usuario
      delete user.password;

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);



