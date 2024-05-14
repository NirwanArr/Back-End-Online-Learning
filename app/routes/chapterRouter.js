const router = require('express').Router();
const AuthMe = require('../middlewares/authMe');

const Chapter = require('../controller/chapterController');

router.get('/', AuthMe, Chapter.findAllChapter);
router.post('/create/:id', AuthMe, Chapter.createChapter); // create course dengan mengambil id course
router.get('/:id', AuthMe, Chapter.findChapter);
router.put('/update/:id', AuthMe, Chapter.updateChapter);
router.delete('/delete/:id', AuthMe, Chapter.deleteChapter);

module.exports = router;
