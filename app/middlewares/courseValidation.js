const ApiError = require('../../utils/apiError');

const couseValidation = async (req, res, next) => {
  const {
    coursePrice,
    courseDiscountInPercent,
  } = req.body;

  try {
    if (coursePrice < 0) {
      return next(new ApiError('Harga kursus tidak boleh kurang dari 0', 400));
    }

    if (coursePrice) {
      req.body.courseType = coursePrice > 0 ? 'Premium' : 'Free';
    }

    if (coursePrice > 0 && coursePrice < 10000) {
      return next(new ApiError('Harga kursus harus diatas 10000', 400));
    }

    if (coursePrice <= 0 && courseDiscountInPercent > 0) {
      return next(new ApiError('Gagal memasukkan diskon, karena harga dibawah 10000', 400));
    }

    if (coursePrice > 0 && courseDiscountInPercent < 0) {
      return next(new ApiError('Diskon tidak boleh kurang dari 0%', 400));
    }

    if (courseDiscountInPercent) {
      req.body.isDiscount = courseDiscountInPercent > 0;
    }

    next();
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = couseValidation;
