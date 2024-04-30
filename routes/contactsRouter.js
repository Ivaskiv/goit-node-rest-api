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
//один раз вказуємо, що всі маршрути потребують авторизації
contactsRouter.use(authToken);

contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:id', getContactAndcheckContactOwnership, getOneContact);
contactsRouter.delete('/:id', getContactAndcheckContactOwnership, deleteContact);
contactsRouter.post('/', validateBody(createContactSchema), createContact);

contactsRouter.put(
  '/:id',
  validateBody(updateContactSchema),
  getContactAndcheckContactOwnership,
  updateContactHandler
);

contactsRouter.patch(
  '/:id/favorite',
  validateBody(updateFavoriteSchema),
  getContactAndcheckContactOwnership,
  updateContactFavorite
);

module.exports = contactsRouter;
