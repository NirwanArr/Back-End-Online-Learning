const ApiError = require('../../utils/apiError');

const checkContentBody = (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      next(new ApiError('status must be required!', 400));
    }

    next();
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: `${err.message}`,
    });
  }
};

module.exports = checkContentBody;
