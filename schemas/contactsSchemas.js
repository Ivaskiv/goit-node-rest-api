const Joi = require("joi");

exports.createContactSchema = Joi.object({
name: Joi.string()
.alphanum()
.min(3)
.max(30)
.required(),

email: Joi.string()
.email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net'] }})
.required(),

phone: Joi.string()
.pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
.required(),
})

exports.updateContactSchema = Joi.object({
name: Joi.string()
  .alphanum()
  .min(3)
  .max(30),
email: Joi.string()
.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
phone: Joi.string()
  .pattern(new RegExp(/^\d{3}-\d{3}-\d{4}$/))
})