const express = require('express');
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
} = require('../controllers/contactsControllers.js');

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.post('/', createContact);

contactsRouter.put('/:id', updateContactHandler);

contactsRouter.delete('/:id', deleteContact);

module.exports = contactsRouter;
