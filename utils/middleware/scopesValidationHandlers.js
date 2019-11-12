//Manejo de errores
const boom = require('@hapi/boom');

/**
 * Esta funcion devolera un middleware ya que requerimos intervenir el request y
 * el response de nuestras rutas
 */
function scopesValidationHandler(allowedScopes) {
  return function(req, res, next) {
    //validacion del user y de los scopes, en caso contrario se lanza un error boom
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'));
    }

    // Valiudacion de accesos ya que tenemos Scopes (permisos) publicos y administrativos
    const hasAccess = allowedScopes.map(allowedScope => req.user.scopes.includes(allowedScope))
    .find(allowed => Boolean(allowed));

    if (hasAccess) {
      // Si tiene acceso mandamos a llamar el otro middleware que puede ser el middleware
      // de autenticacion o de validación de datos
      next()
    } else {
      // Si no tiene acceso devolvemos un error boom con el mensaje de Insufficient scopes'
      next(boom.unauthorized('Insufficient scopes'));
    }
  }
}

module.exports = scopesValidationHandler;