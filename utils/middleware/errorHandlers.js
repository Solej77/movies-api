/* eslint-disable no-unused-vars */
/**
 * Traer el archivo de configuracion para saber si se incluye el stack(toda la información relacionada al error) del error,
 *  dependiendo si estamos en desarrollo o en producion.
 */
const { config } = require("../../config");

function withErrorStack(error, stack) {
  if (config.dev) {
    return { error, stack };
  }

  return error;
}

function logErrors(err, req, res, next) {
  console.log(err); //eslint-disable-line
  next(err);
}

//eslint-disable-line
function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.json(withErrorStack(err.message, err.stack));
}

module.exports = {
  logErrors,
  errorHandler
};
