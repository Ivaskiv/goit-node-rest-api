const messageList = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

// Функція, яка обробляє помилки і оптимізує код контролера
const errorWrapper = fn => {
  const ew = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode = error.status || 500;
      const errorMessage = error.message || messageList[statusCode] || 'Internal Server Error';
      res.status(statusCode).json({ message: errorMessage });
    }
  };

  return ew;
};

module.exports = { errorWrapper };
