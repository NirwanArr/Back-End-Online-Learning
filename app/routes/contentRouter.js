const router = require('express').Router();

const Content = require('../controller/contentController');
const authMe = require('../middlewares/authMe');

// const checkContentBody = require('../middlewares/checkContentBody')

router.get('/', authMe, Content.getContent);
router.get('/:contentId', authMe, Content.getContentByid);
router.delete('/deleted/:contentId', authMe, Content.deleteContentByid);
router.post('/insert-bylink/:chapterId', authMe, Content.insertContentByLink);
router.patch(
  '/update-bylink/:chapterId/:contentId',
  authMe,
  Content.updateContentByLink,
);

// router.post(
//   '/insert-byfile/:chapterId',
//   upload.single('fileVideo'),
//   checkContentBody,
//   Content.insertContentByFile
// );

// router.patch(
//   '/update-byfile/:chapterId/:contentId',
//   upload.single('fileVideo'),
//   Content.updateContentByFile
// );
// test

module.exports = router;
