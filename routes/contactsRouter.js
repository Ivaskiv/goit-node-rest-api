const express = require('express');
const { validateBody } = require('../helpers/validateBody.js');
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
} = require('../controllers/contactsControllers.js');
const { createContactSchema, updateContactSchema } = require('../schemas/contactsSchemas.js');

const contactsRouter = express.Router();
contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:id', getOneContact);
contactsRouter.delete('/:id', deleteContact);

// contactsRouter.post('/', createContact);
// contactsRouter.put('/:id', updateContactHandler);

contactsRouter.post('/', validateBody(createContactSchema), createContact);
contactsRouter.put('/:id', validateBody(updateContactSchema), updateContactHandler);

module.exports = contactsRouter;
