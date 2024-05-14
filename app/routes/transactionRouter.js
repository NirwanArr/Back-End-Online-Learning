const router = require('express').Router();

const Transaction = require('../controller/transactionController');
const authMe = require('../middlewares/authMe');
const checkRole = require('../middlewares/checkRole');

router.post('/payment-callback', Transaction.paymentCallback);
router.post('/:courseId', authMe, Transaction.createTransactionSnap);

router.get('/', authMe, checkRole(['admin']), Transaction.getAllTransaction);
router.get('/history', authMe, Transaction.getUserTransaction);
router.get('/:order_id', authMe, Transaction.getPaymentDetail);

module.exports = router;
