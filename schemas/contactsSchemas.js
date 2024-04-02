const Joi = require('joi');

exports.createContactSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({ 'any.required': 'Missing required name field' }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .messages({ 'any.required': 'Missing required email field' }),

  phone: Joi.string()
    .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
    .required()
    .messages({ 'any.required': 'Missing required phone field' }),
});

exports.updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/)),
});
