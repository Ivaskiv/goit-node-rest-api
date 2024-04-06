//contactModel
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Перевірка за допомогою регулярного виразу або Joi
        // Приклад регулярного виразу для перевірки формату номера телефону
        return /^\(\d{3}\) \d{3}-\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
