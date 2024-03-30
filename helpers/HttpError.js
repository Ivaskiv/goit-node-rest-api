const messageList = {
 400: 'Bad Request',
 401: 'Unauthorized',
 403: 'Forbidden',
 404: 'Not Found',
 409: 'Conflict',
};
// ф-я, яка створює об'єкт помилки з HTTP статусом і повідомленням
const HttpError = (status, message = messageList[status]) => {
 const error = new Error(message);
 error.status = status;
 return error;
};

// Ф-я-обгортка, що обробляє помилки / оптимізує код contactsControllers.js (try...catch)
const errorWrapper = async fn => {
 return async (req, res) => {
  try {
   await fn(req, res);
  } catch (error) {
   const statusCode = error.status || 500;
   const errorMessage = error.message || messageList[statusCode] || 'Internal server ERROR';
   res.status(statusCode).json({
    message: errorMessage,
   });
  }
 };
};

module.exports = { HttpError, errorWrapper };
