const contactsService = require('../services/contactsServices.js');
const { HttpError } = require('../helpers/HttpError.js');
const { errorWrapper } = require('../helpers/errorWrapper.js');

// GET /api/contacts => getAllContacts - список усіх контактів
const getAllContacts = errorWrapper(async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
});

// GET /api/contacts/:id => getOneContact - отримує контакт за його ID
const getOneContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (!contact) {
    throw new HttpError(404, 'Contact not found');
  }
  res.status(200).json(contact);
});

// DELETE /api/contacts/:id => deleteContact - видаляє контакт за його ID
const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (result) {
    res.status(200).json({ message: 'Contact deleted successfully', contacts: result.contacts });
  } else {
    throw new HttpError(404, 'Contact not found');
  }
});

// POST /api/contacts => createContact - створює новий контакт
const createContact = errorWrapper(async (req, res, next) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
});

// PUT /api/contacts/:id => updateContactHandler - оновлює контакт за його ідентифікатором
const updateContactHandler = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw new HttpError(404, 'Contact not found');
  }
  res.status(200).json(result);
});

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
};
