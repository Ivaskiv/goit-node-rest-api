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
const getContactAndcheckContactOwnership = require('../helpers/getContactAndcheckContactOwnership.js');

const contactsRouter = express.Router();

contactsRouter.get('/', authToken, getAllContacts);

contactsRouter.get('/:id', authToken, getContactAndcheckContactOwnership, getOneContact);

contactsRouter.delete('/:id', authToken, getContactAndcheckContactOwnership, deleteContact);

contactsRouter.post('/', authToken, validateBody(createContactSchema), createContact);

contactsRouter.put(
  '/:id',
  authToken,
  validateBody(updateContactSchema),
  getContactAndcheckContactOwnership,
  updateContactHandler
);

contactsRouter.patch(
  '/:id/favorite',
  authToken,
  validateBody(updateFavoriteSchema),
  getContactAndcheckContactOwnership,
  updateContactFavorite
);

module.exports = contactsRouter;
