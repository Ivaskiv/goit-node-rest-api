//userSchema.js
const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(30).required(),
});

const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(30).required(),
});
const verifyUserSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { createUserSchema, loginUserSchema, verifyUserSchema };
