// Por ahora siempre nos va a marcar como valido cualquier validacion que le pasemos
function validate() {
  return false;
}

function validationHandler(schema, check = "body") {
  return function(req, res, next) {
    const error = validate(req[check], schema);

    error ? next(new Error(error)) : next();
  };
}

module.exports = validationHandler;
