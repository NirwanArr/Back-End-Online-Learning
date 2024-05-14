const router = require('express').Router();
const multer = require('../middlewares/multer');
const User = require('../controller/userController');
const authenticate = require('../middlewares/authMe');
const checkRole = require('../middlewares/checkRole');

router.get('/', User.getUsers);
router.get('/get', User.getUserByEmail);
router.patch(
  '/update/:id',
  authenticate,
  checkRole(['member']),
  multer.single('image'),
  User.updateUser,
);
router.delete(
  '/delete/:id',
  authenticate,
  checkRole(['admin']),
  User.deleteUser,
);
router.patch(
  '/change-password/:userId',
  authenticate,
  checkRole(['member']),
  User.changePassword,
);

module.exports = router;
