const Joi = require('joi');

const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().pattern(phonePattern).required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  phone: Joi.string().pattern(phonePattern),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
};
