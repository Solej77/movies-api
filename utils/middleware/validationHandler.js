const boom = require("@hapi/boom");

// Por ahora siempre nos va a marcar como valido cualquier validacion que le pasemos
function validate() {
  return false;
}

function validationHandler(schema, check = "body") {
  return function(err, req, res, next) {
    const error = validate(req[check], schema);

    // boom.badRequest(error), lo que hace es devolernos el error de que los datos no son validos.
    error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;
