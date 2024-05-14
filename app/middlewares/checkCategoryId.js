const ApiError = require('../../utils/apiError');
const { Category } = require('../models');

const checkCourseId = async (req, res, next) => {
  try {
    const isCategoryExist = await Category.findByPk(req.params.id);
    if (!isCategoryExist) {
      next(new ApiError(`category with id ${req.params.id} not found`, 404));
      return;
    }
    next();
  } catch (err) {
    next(new ApiError('internal server error', 500));
  }
};

module.exports = checkCourseId;
