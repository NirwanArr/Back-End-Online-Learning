const router = require('express').Router();

const Auth = require('../controller/authController');
const Otp = require('../controller/OtpConroller');
const authMe = require('../middlewares/authMe');
const validateEmail = require('../middlewares/emailValidatorMiddleware');

router.post('/admin/login', Auth.authenticateAdmin);

router.post('/member/register', validateEmail, Auth.register);
router.post('/member/login', Auth.login);
router.get('/me', authMe, Auth.authenticate);

router.post('/verify-otp/:userId', Otp.verifyOTP);
router.post('/new-otp', Otp.sendOtp);

router.post('/forgot-password', Otp.sendOtp);
router.post('/forgot-password/:userId', Otp.verifyOTP);
router.patch('/reset-password/:userId', Auth.updateNewPassword);

module.exports = router;
