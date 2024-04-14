const validateBody = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    console.error('Validation error:', error.details);
    // відправлення відповіді з кодом 400 і деталями помилки
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = { validateBody };
