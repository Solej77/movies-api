const boom = require("@hapi/boom");

function notFoundHandler(req, res) {
  /**
   * Obtenemos el error 404 desde boom.notFound(), es por eso que unicamente solicitamos el statusCode (que ya sabemos que va ser el 404)
   * y el payload que es la información del error
   */
  const {
    output: { statusCode, payload }
  } = boom.notFound();

  // en la respuesta mandamos el status del error y la informacion de la misma.
  res.status(statusCode).json(payload);
}

module.exports = notFoundHandler;