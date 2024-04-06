const HttpError = require('../helpers/HttpError.js');
const contactsService = require('../services/contactsServices.js');
const Contact = require('../models/contactModel.js');
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
  if (result.code === 200) {
    res.status(200).json({ message: 'Contact deleted successfully', contacts: result });
  } else {
    throw new HttpError(result.code, result.message);
  }
});

// POST /api/contacts => createContact - створює новий контакт
const createContact = errorWrapper(async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    msg: 'success!!!',
    contact: newContact,
  });
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

//PATCH /api/contacts/:contactId/favorite - оновлює статус контакту
const updateContactFavorite = errorWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) throw new HttpError(400, 'Favorite status must be provided');

  const existingContact = await contactsService.getContactById(contactId);

  if (!existingContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const updatedContact = await contactsService.updateStatusContact(contactId, { favorite });

  if (!updatedContact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  return res.status(200).json(updatedContact);
});

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
  updateContactFavorite,
};
