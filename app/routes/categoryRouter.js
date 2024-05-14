const router = require('express').Router();
const multer = require('../middlewares/multer');
const categoryController = require('../controller/categoryController');
const checkCategoryId = require('../middlewares/checkCategoryId');
const checkRole = require('../middlewares/checkRole');
const authenticate = require('../middlewares/authMe');

router.get('/', categoryController.getAllCategory);
router.post(
  '/create',
  authenticate,
  checkRole(['admin']),
  multer.single('image'),
  categoryController.createCategory,
);
router.get('/:id', checkCategoryId, categoryController.getOneCategory);
router.patch(
  '/update/:id',
  authenticate,
  checkRole(['admin']),
  checkCategoryId,
  multer.single('image'),
  categoryController.updateCategory,
);
router.delete(
  '/delete/:id',
  authenticate,
  checkRole(['admin']),
  checkCategoryId,
  categoryController.deleteCategory,
);

module.exports = router;
