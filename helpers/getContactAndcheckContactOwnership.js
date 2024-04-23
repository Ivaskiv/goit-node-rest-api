//Middleware checkContactOwnership - для перевірки,
//чи користувач є власником контакту перед виконанням
//операцій над контактом

//getContactAndcheckContactOwnership.js
const mongoose = require('mongoose');
const contactsService = require('../services/contactsServices.js');
const { errorWrapper } = require('./errorWrapper.js');

const getContactAndcheckContactOwnership = errorWrapper(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  const contact = await contactsService.getContactById(id);

  if (!contact) {
    return next({ status: 404, message: 'Not found' });
  }

  if (contact.owner == req.user._id) {
    return next({ status: 401, message: 'Not authorized' });
  }

  next();
});

module.exports = getContactAndcheckContactOwnership;
