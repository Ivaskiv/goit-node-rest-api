const contactsService = require('../services/contactsServices');
const validateBody = require('../helpers/validateBody');
const { HttpError, errorWrapper } = require('../helpers/HttpError');
const { createContactSchema, updateContactSchema } = require('../schemas/contactsSchemas');

// GET /api/contacts => getAllContacts - список усіх контактів
const getAllContacts = errorWrapper(async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
});

// GET /api/contacts/:id => getOneContact - отримує контакт за його ID
const getOneContact = errorWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw new HttpError(404, 'Contact not found');
  }

  res.status(200).json(contact);
});

// DELETE /api/contacts/:id => deleteContact - видаляє контакт за його ID
const deleteContact = errorWrapper(async (req, res) => {
  const { id } = req.params;
  const deletionResult = await contactsService.removeContact(id);

  if (deletionResult.code === 200) {
    res
      .status(200)
      .json({ message: 'Contact deleted successfully', contacts: deletionResult.contacts });
  } else {
    throw new HttpError(404, 'Contact not found');
  }
});

// POST /api/contacts => createContact - створює новий контакт
const createContact = errorWrapper(async (req, res) => {
  validateBody(createContactSchema, req);

  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
});

//PUT /api/contacts/:id => updateContactHandler - оновлює контакт за його ідентифікатором
const updateContactHandler = errorWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (Object.values(updateData).length === 0) {
    throw new HttpError(400, 'Body must have at least one field');
  }

  validateBody(updateContactSchema, req.body);
  const updatedContact = await contactsService.updateContactById(id, updateData);

  if (!updatedContact) {
    throw new HttpError(404, 'Contact not found');
  }

  res.status(200).json(updatedContact);
});

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactHandler,
};
