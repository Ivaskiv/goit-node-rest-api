//contactSchema.js
const mongoose = require('mongoose');
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
  //owner - посилання на користувача, який створив контакт
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).trim().optional(),
  phone: Joi.string().pattern(/^\d+$/).when('$isPhoneProvided', {
    is: true,
    then: Joi.required(), //телефон буде обов'язковим, якщо він переданий
    otherwise: Joi.optional(), //в іншому випадку, валідація буде пропущена
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
};
