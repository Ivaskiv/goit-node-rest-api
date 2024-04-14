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
    throw HttpError(404, 'Contact not found');
  }
  res.status(200).json(contact);
});

// DELETE /api/contacts/:id => deleteContact - видаляє контакт за його ID
const deleteContact = errorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  //❌ В разі успішного запиту на видалення (DELETE) має повертатись саме об'єкт видаленого контакту
  //❌ В разі запиту на видалення по неіснуючому айді має повертатись об'єкт з ключем message і значенням "Not found", статус 404.
  if (result.code === 200) {
    res.status(200).json(result.contacts[0]);
  } else {
    throw HttpError(404, 'Contact not found');
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
  //❌ Якщо запит на оновлення здійснено без передачі в body хоча б одного поля, має повертатись json формату {""message"": "Body must have at least one field"} зі статусом 400.
  //перевірка наявності оновлених даних у запиті
  if (!req.body || Object.keys(req.body).length === 0) {
    throw HttpError(400, 'Body must have at least one field');
  }

  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, 'Contact not found');
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
