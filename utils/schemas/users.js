// nos permite definir el esquema que va a ser usado en la colección de usuarios
const joi = require('@hapi/joi');

// Esquema de validaciones
const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserSchema = {
  name: joi.string().max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  isAdmin: joi.boolean()
}

module.exports = {
  userIdSchema,
  createUserSchema
};
