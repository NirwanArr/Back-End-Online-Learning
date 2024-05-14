const ApiError = require('../../utils/apiError');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return next(new ApiError('Alamat email tidak valid.', 400));
  }

  next();
};

module.exports = validateEmail;
