const Midtrans = require('midtrans-client');
const crypto = require('crypto');
const { Op } = require('sequelize');
const {
  Transaction, Course, CourseUser, Notification, NotificationRead,
} = require('../models');
const ApiError = require('../../utils/apiError');
const mathRandom = require('../../utils/generatedOTP');

const { CLIENT_KEY, SERVER_KEY } = process.env;

const createTransactionSnap = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const existingTransaction = await Transaction.findOne({
      where: {
        userId: req.user.id,
        courseId,
        paymentStatus: 'unpaid',
      },
    });

    const hasPurchasedBefore = await Transaction.findOne({
      where: {
        userId: req.user.id,
        courseId,
        paymentStatus: 'paid',
      },
    });

    if (hasPurchasedBefore) {
      return next(new ApiError('Anda sudah membeli kursus ini sebelumnya', 400));
    }

    if (existingTransaction) {
      return next(
        new ApiError(
          'Anda memiliki transaksi yang belum dibayar untuk kursus ini, silahkan cek riwayat transaksi',
          409,
        ),
      );
    }

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(
        new ApiError(`Kursus dengan ID: ${courseId} tidak ditemukan`, 404),
      );
    }

    if (course.coursePrice === 0) {
      return res.status(200).json({
        status: 'Success',
        message: 'Kursus ini gratis',
      });
    }

    const quantity = 1;
    const ppnRate = 0.11;
    const ppn = course.coursePrice * ppnRate;
    const totalPrice = course.coursePrice + ppn;

    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: SERVER_KEY,
      clientKey: CLIENT_KEY,
    });

    const random = await mathRandom();

    const data = {
      item_details: [
        {
          id: course.id,
          name: course.courseName,
          price: totalPrice,
          quantity,
        },
      ],
      transaction_details: {
        order_id: random,
        gross_amount: totalPrice * quantity,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.Auth.email,
        phone: req.user.phoneNumber,
      },
    };

    const transaction = await snap.createTransaction(data);

    const createdTransactionData = await Transaction.create({
      courseName: course.courseName,
      userId: req.user.id,
      courseId: course.id,
      totalPrice: data.transaction_details.gross_amount,
      ppn,
      price: course.coursePrice,
      orderId: data.transaction_details.order_id,
      linkPayment: transaction.redirect_url,
    });

    res.status(201).json({
      status: 'Success',
      createdTransactionData,
      course,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const paymentCallback = async (req, res, next) => {
  try {
    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      transaction_status: transactionStatus,
      signature_key: signatureKey,
      payment_type: paymentType,
    } = req.body;

    const serverKey = SERVER_KEY;

    const hashed = crypto
      .createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex');

    if (hashed === signatureKey) {
      if (
        transactionStatus === 'settlement'
        || transactionStatus === 'capture'
      ) {
        const payment = await Transaction.findOne({
          where: { orderId },
        });
        if (!payment) return next(new ApiError('Transaksi tidak ada', 404));

        await payment.update({
          paymentStatus: 'paid',
          paymentMethod: paymentType,
        });

        const newCourseUser = await CourseUser.create({
          courseId: payment.courseId,
          userId: payment.userId,
          courseStatus: 'inProgress',
        });

        const notif = await Notification.create({
          userId: payment.userId,
          courseId: payment.courseId,
          courseUserId: newCourseUser.id,
          titleNotification: 'Kelas',
          typeNotification: 'Notifikasi',
          description: `Selamat pembayaran Anda berhasil, sekarang anda telah terdaftar di Kelas ${payment.courseName}. Ayo selesaikan segera!`,
        });

        await NotificationRead.create({
          notifId: notif.id,
          userId: notif.userId,
        });
      }
    }

    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    next(new ApiError(`Gagal melakukan transaksi: ${err.message}`, 500));
  }
};

const getAllTransaction = async (req, res, next) => {
  try {
    const { search, paymentStatus } = req.query;

    const filter = {};

    if (search) {
      filter['$User.name$'] = { [Op.iLike]: `%${search}%` };
    }

    if (paymentStatus && ['paid', 'unpaid'].includes(paymentStatus)) {
      filter.paymentStatus = paymentStatus;
    }

    const transactions = await Transaction.findAll({
      include: ['User'],
      where: filter,
    });

    if (!transactions || transactions.length === 0) {
      return next(
        new ApiError('Data transaksi kosong atau tidak ditemukan', 404),
      );
    }

    res.status(200).json({
      status: 'Success',
      transactions,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getUserTransaction = async (req, res, next) => {
  try {
    const userTransactions = await Transaction.findAll({
      where: {
        userId: req.user.id,
      },
      include: ['Course'],
    });

    if (userTransactions.length === 0) {
      return next(new ApiError('Data transaksi kosong', 404));
    }

    const formattedTransactions = userTransactions.map((transaction) => ({
      id: transaction.id,
      orderId: transaction.orderId,
      ppn: transaction.ppn,
      price: transaction.price,
      totalPrice: transaction.totalPrice,
      paymentStatus: transaction.paymentStatus,
      paymentMethod: transaction.paymentMethod,
      userId: transaction.userId,
      courseId: transaction.courseId,
      linkPayment: transaction.linkPayment,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      course: {
        id: transaction.Course.id,
        courseCode: transaction.Course.courseCode,
        categoryId: transaction.Course.categoryId,
        adminId: transaction.Course.userId,
        courseName: transaction.Course.courseName,
        image: transaction.Course.image,
        courseType: transaction.Course.courseType,
        courseLevel: transaction.Course.courseLevel,
        rating: transaction.Course.rating,
        aboutCourse: transaction.Course.aboutCourse,
        intendedFor: transaction.Course.intendedFor,
        coursePrice: transaction.Course.coursePrice,
        createdAt: transaction.Course.createdAt,
        updatedAt: transaction.Course.updatedAt,
      },
    }));

    res.status(200).json({
      status: 'Success',
      userTransactions: formattedTransactions,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getPaymentDetail = async (req, res, next) => {
  try {
    const { order_id: orderId } = req.params;
    const detailTransaction = await Transaction.findOne({
      where: { orderId },
      include: ['User'],
    });
    if (!detailTransaction) {
      return next(
        new ApiError(
          `Detail pembayaran dengan ID: ${orderId} tidak ditemukan`,
          404,
        ),
      );
    }

    res.status(200).json({
      status: 'Success',
      detailTransaction,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  createTransactionSnap,
  paymentCallback,
  getAllTransaction,
  getPaymentDetail,
  getUserTransaction,
};
