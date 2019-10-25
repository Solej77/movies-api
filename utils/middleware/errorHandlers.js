/* eslint-disable no-unused-vars */
/**
 * Traer el archivo de configuracion para saber si se incluye el stack(toda la información relacionada al error) del error,
 *  dependiendo si estamos en desarrollo o en producion.
 */
const boom = require("@hapi/boom");
const { config } = require("../../config");

function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

function logErrors(err, req, res, next) {
  console.log(err); //eslint-disable-line
  next(err);
}

/**
 * Esta funcion se define ya que puede que en algun punto nos llegue un error que no es de tipo Boom, en caso de no ser de tipo Boom
 * se obliga a que se de tipo Boom con la siguiente instruccion.
 */
function wrapErrors(err, req, res, next) {
  // Valida de que el error sea de tipo boom, con la siguiente particularidad err.isBoom
  if (!err.isBoom) {
    // Se manda a llamar el siguiente middleware, obligando a que el error sea de tipo Boom
    next(boom.badImplementation(err));
  }

  // en caso de que el error sea de tipo boom unicamente se manda al siguiente middleware
  next(err);
}

//eslint-disable-line
function errorHandler(err, req, res, next) {
  /**
   * Dentro de este manejador de errores como ya estamos garantizanfo de que el error se de tipo boom gracias al middleware wrapErrors,
   * debemos de sacar el output
   */
  const {
    output: { statusCode, paylod }
  } = err;

  res.status(statusCode || 500);
  res.json(withErrorStack(paylod, err.stack));
}

// Es importante de que se vayan exportando en el mismo orden que se fueron creando estos middleware
module.exports = {
  logErrors,
  wrapErrors,
  errorHandler
};
