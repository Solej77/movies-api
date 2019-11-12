// Se va a requerir un nuevo router es por eso que exportamos Express
const express = require("express");

//Para realizar la autenticación
const passport = require("passport");

// boom para controloar errores
const boom = require("@hapi/boom");

// Uso de JSON Web Token
const jwt = require("jsonwebtoken");

// Nuestro negocio (servicio) de apiKeys para obtener los Scopes (permisos) acorde al token que se envie
const ApiKeysService = require("../services/apiKeys");

// Traemos nuestra capa de negocio, quien nos a yudar a crear un usuario
const UsersService = require("../services/users");

// Con esto validamos que los datos del usuario son correctos
const validationHandler = require("../utils/middleware/validationHandler");

// Nos permite definir el esquema que va a ser usado en la colección de usuarios
const { createUserSchema } = require("../utils/schemas/users");

// Hacemos destructurin para obtener las variales de configuracion
const { config } = require("../config");

//Basic Strategy
require("../utils/auth/strategies/basic");

function authApi(app) {
  //Definimos la ruta de nuestro end point
  const router = express.Router();
  app.use("/api/auth", router);

  const apiKeysService = new ApiKeysService();
  const usersService = new UsersService();

  router.post("/sign-in", async function(req, res, next) {
    /**
     * Tomamos del body el atributo apiKeyToken, que sera el token que le vamos a pasar al sign-in para determinar que clase de permisos
     * vamos a firmar en el JSON Web Token que vamos a devolver
     */
    const { apiKeyToken } = req.body;

    // Verificar que si el token no existe, vamos a devolver un callback next
    if (!apiKeyToken) {
      next(boom.unauthorized("apiKeyToken is requeried"));
    }

    passport.authenticate("basic", function(error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized());
        }
        req.login(user, { session: false }, async function(error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          // Cnstruimos nuestro API Token
          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: "15min"
          });

          return res.status(200).json({ token, user: { id, name, email } });
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

  router.post("/sign-up", validationHandler(createUserSchema), async function(
    req,
    res,
    next
  ) {
    // Sacar el body del user
    const { body: user } = req;

    // Como estamos usando un funcion asincrona tenemos que implementar el try catch
    try {
      // Creamos e usuario
      const createUserId = await usersService.createUser({ user });

      res.status(201).json({
        data: createUserId,
        message: "user created"
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = authApi;
