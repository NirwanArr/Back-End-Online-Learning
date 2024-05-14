const ApiError = require('../../utils/apiError');
const { Course } = require('../models');

const checkCourseId = async (req, res, next) => {
  try {
    const isCourseExist = await Course.findByPk(req.params.id);
    if (!isCourseExist) {
      return next(new ApiError(`Kursus dengan id ${req.params.id} tidak ditemukan`, 404));
    }
    next();
  } catch (err) {
    next(new ApiError('Internal server error', 500));
  }
};

module.exports = checkCourseId;
