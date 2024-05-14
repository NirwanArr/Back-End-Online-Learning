const router = require('express').Router();
const authMe = require('../middlewares/authMe');
const Notification = require('../controller/notificationController');

router.get('/getAllNotif', Notification.getAllNotification);
router.get('/getNotifByUserId', authMe, Notification.getNotifByUserId);
router.get('/getDetailNotif/:notifId', authMe, Notification.getDetailNotif);

module.exports = router;
