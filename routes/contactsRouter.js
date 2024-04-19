//contactsRouter.js
const express = require('express');

const { validateBody } = require('../helpers/validateBody.js');
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
  updateContactFavorite,
} = require('../controllers/contactsControllers.js');
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require('../schemas/contactsSchemas.js');
const { authToken } = require('../helpers/authToken.js');

const contactsRouter = express.Router();

contactsRouter.get('/', authToken, getAllContacts);

contactsRouter.get('/:id', authToken, getOneContact);

contactsRouter.delete('/:id', authToken, deleteContact);

contactsRouter.post('/', authToken, validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', authToken, validateBody(updateContactSchema), updateContactHandler);

contactsRouter.patch(
  '/:contactId/favorite',
  authToken,
  validateBody(updateFavoriteSchema),
  updateContactFavorite
);

module.exports = contactsRouter;
