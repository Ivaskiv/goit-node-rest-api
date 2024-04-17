//contactsController.js
const mongoose = require('mongoose');
const Contact = require('../models/contactModel.js');
const HttpError = require('../helpers/HttpError.js');
const contactsService = require('../services/contactsServices.js');
const { errorWrapper } = require('../helpers/errorWrapper.js');

// GET /api/contacts => getAllContacts - список усіх контактів
const getAllContacts = errorWrapper(async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
});

// GET /api/contacts/:id => getOneContact - отримує контакт за його ID
const getOneContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  const contact = await contactsService.getContactById(id);

  if (!contact) {
    return next({ status: 404, message: 'Not found' });
  }

  res.status(200).json(contact);
});

// DELETE /api/contacts/:id => deleteContact - видаляє контакт за його ID
const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  const result = await contactsService.removeContact(id);

  if (result.code === 200) {
    res.status(200).json(result.contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// POST /api/contacts => createContact - створює новий контакт
const createContact = errorWrapper(async (req, res, next) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);

  if (!newContact) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/contacts/:id => updateContactHandler - оновлює контакт за його ідентифікатором
const updateContactHandler = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Body must have at least one field' });
  }
  const result = await contactsService.updateContactById(id, req.body);

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.status(200).json(result);
});

//PATCH /api/contacts/:contactId/favorite - оновлює статус контакту
const updateContactFavorite = errorWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: 'Favorite status must be provided' });
  }

  const existingContact = await contactsService.getContactById(contactId);

  if (!existingContact) {
    return res.status(404).json({ message: 'Not found' });
  }

  const updatedContact = await contactsService.updateStatusContact(contactId, { favorite });

  if (!updatedContact) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json(updatedContact);
});

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
  updateContactFavorite,
};
