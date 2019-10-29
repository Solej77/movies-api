const boom = require("@hapi/boom");

// nos sirve para realizar validaciones
const joi = require("@hapi/joi");

// Por ahora siempre nos va a marcar como valido cualquier validacion que le pasemos
function validate(data, schema) {
  const { error } = joi.validate(data, schema);
  return error;
}

function validationHandler(schema, check = "body") {
  return function(req, res, next) {
    const error = validate(req[check], schema);

    // boom.badRequest(error), lo que hace es devolernos el error de que los datos no son validos.
    error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;
