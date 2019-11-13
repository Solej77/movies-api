// nos permite definir el esquema que va a ser usado en la colección de usuarios
const joi = require('@hapi/joi');
// Esquema de validaciones
const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userSchema = {
  name: joi
    .string()
    .max(100)
    .required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required()
};

const createUserSchema = {
  ...userSchema,
  isAdmin: joi.boolean()
};

const createProviderUserSchema = {
  ...userSchema,
  apiKeyToken: joi.string().required()
};

module.exports = {
  userIdSchema,
  createUserSchema,
  createProviderUserSchema
};
