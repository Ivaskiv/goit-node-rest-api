const Joi = require('joi');

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
};
