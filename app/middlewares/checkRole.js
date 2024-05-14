const ApiError = require('../../utils/apiError');

// const checkRole = (roles) => async (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return next(
//       new ApiError(
//         `Anda bukan ${roles.toString()}, sehingga Anda tidak memiliki akses.`,
//         401,
//       ),
//     );
//   }
//   next();
// };

const checkRole = (roles) => async (req, res, next) => {
  try {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(`Anda bukan ${roles.join(', ')}, sehingga Anda tidak memiliki akses.`, 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkRole;
