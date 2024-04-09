const mongoose = require('mongoose');
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim(),
  phone: Joi.string().pattern(phonePattern),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
};
