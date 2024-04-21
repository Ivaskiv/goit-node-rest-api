//Middleware checkContactOwnership - для перевірки,
//чи користувач є власником контакту перед виконанням
//операцій над контактом

const mongoose = require('mongoose');
const contactsService = require('../services/contactsServices.js');
const { errorWrapper } = require('../helpers/errorWrapper.js');

const checkContactOwnership = errorWrapper(async (req, res, next) => {
  const { id, contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId) || !mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  const contact = id
    ? await contactsService.getContactById(id)
    : await contactsService.getContactById(contactId);

  if (!contact) {
    return next({ status: 404, message: 'Not found' });
  }

  if (contact.owner.toString() !== req.user._id.toString()) {
    return next({ status: 401, message: 'Not authorized' });
  }

  next();
});

module.exports = checkContactOwnership;
