//contactsController.js
const contactsService = require('../services/contactsServices.js');
const { errorWrapper } = require('../helpers/errorWrapper.js');

module.exports = {
  // POST /api/contacts => createContact - створює новий контакт
  createContact: errorWrapper(async (req, res, next) => {
    const newContact = await contactsService.addContact({ ...req.body, owner: req.user._id });
    return res.status(201).json(newContact);
  }),

  // GET /api/contacts => getAllContacts - список усіх контактів
  getAllContacts: errorWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const contacts = await contactsService.listContacts(userId);
    res.status(200).json(contacts);
  }),

  // GET /api/contacts/:id => getOneContact - отримує контакт за його ID
  getOneContact: errorWrapper(async (req, res, next) => {
    const contact = req.contact;
    res.status(200).json(contact);
  }),

  // DELETE /api/contacts/:id => deleteContact - видаляє контакт за його ID
  deleteContact: errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    res.status(200).json(deletedContact);
  }),

  // PUT /api/contacts/:id => updateContactHandler - оновлює контакт за його ідентифікатором
  updateContactHandler: errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedContact = await contactsService.updateContactById(id, req.body);
    res.status(200).json(updatedContact);
  }),

  // PATCH /api/contacts/:contactId/favorite - оновлює статус контакту
  updateContactFavorite: errorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { favorite } = req.body;
    const updatedContact = await contactsService.updateStatusContact(id, { favorite });
    res.status(200).json(updatedContact);
  }),
};

//owner - це поле, яке вказує на власника контакту,
//в базі даних це буде ідентифікатор користувача, який створив цей контакт
