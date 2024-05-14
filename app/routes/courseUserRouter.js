const router = require('express').Router();
const CourseUser = require('../controller/courseUserController');
const authenticate = require('../middlewares/authMe');
const checkRole = require('../middlewares/checkRole');

router.get(
  '/my-course',
  authenticate,
  checkRole(['member']),
  CourseUser.getAllMyCourse,
);
router.get(
  '/my-course/:courseUserId',
  authenticate,
  checkRole(['member']),
  CourseUser.getOneMyCourse,
);
router.post(
  '/create/:courseId',
  authenticate,
  checkRole(['member']),
  CourseUser.addToCourseUser,
);
router.patch(
  '/update-progress/:courseUserId/progress/:contentId',
  authenticate,
  checkRole(['member']),
  CourseUser.updateCourseStatus,
);

module.exports = router;
