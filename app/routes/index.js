const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../../docs/swagger.json');

router.use('/api-docs', swaggerUI.serve);
router.use('/api-docs', swaggerUI.setup(swaggerDocument));

const Auth = require('./authRouter');
const User = require('./userRouter');
const CourseUser = require('./courseUserRouter');
const Courses = require('./courseRouter');
const Chapter = require('./chapterRouter');
const Content = require('./contentRouter');
const Category = require('./categoryRouter');
const Welcome = require('../controller/welcomController');
const transaction = require('./transactionRouter');
const notification = require('./notificationRouter');

router.use('/api/v1/auth', Auth);
router.use('/api/v1/user', User);
router.use('/api/v1/course-user', CourseUser);
router.use('/api/v1/course', Courses);
router.use('/api/v1/chapter', Chapter);
router.use('/api/v1/content', Content);
router.use('/api/v1/category', Category);
router.use('/api/v1/transaction', transaction);
router.use('/api/v1/notification', notification);
// router.use('/', Welcome.welcome)

module.exports = router;
