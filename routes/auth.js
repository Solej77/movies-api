// Se va a requerir un nuevo router es por eso que exportamos Express
const express = require('express');

//Para realizar la autenticación
const passport = require('passport');

// boom para controloar errores
const boom = require('@hapi/boom');

// Uso de JSON Web Token
const jwt = require('jsonwebtoken');

// Nuestro negocio (servicio) de apiKeys para obtener los Scopes (permisos) acorde al token que se envie
const ApiKeysService = require('../services/apiKeys');

// Hacemos destructurin para obtener las variales de configuracion
const { config } = require('../config');

//Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  //Definimos la ruta de nuestro end point
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeysService = new ApiKeysService();

  router.post('/sign-in', async function(req, res, next) {
    /**
     * Tomamos del body el atributo apiKeyToken, que sera el token que le vamos a pasar al sign-in para determinar que clase de permisos
     * vamos a firmar en el JSON Web Token que vamos a devolver
     */
    const { apiKeyToken } = req.body;

    // Verificar que si el token no existe, vamos a devolver un callback next
    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is requeried'));
    }

    
    passport.authenticate('basic', function(error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }
        req.login(user, {session: false}, async function(error){
          if (error) {
            next(error)
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          // Cnstruimos nuestro API Token
          const {_id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          }

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15min'
          });

          return res.status(200).json({ token, user: {id, name, email }});
        });
      } catch (error) {
        next(error);
      }
    /**
     * como el authenticate es un custom callback, debemos hacer un clusteer "})(req, res, next);", de esta manera garantizamos que nuestro
     * authenticate y custom callback funcionen sin problemas
     */
    })(req, res, next);
  });
}

module.exports = authApi;