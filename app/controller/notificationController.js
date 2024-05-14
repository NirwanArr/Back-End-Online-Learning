const { Op } = require('sequelize');
const ApiError = require('../../utils/apiError');
const {
  Course,
  User,
  Notification,
  CourseUser,
  NotificationRead,
} = require('../models');
require('dotenv').config();

// const getAllNotification = async (req, res, next) => {
//   try {
//     const notification = await Notification.findAll({
//       include: [
//         {
//           model: User,
//           attributes: {
//             exclude: ['createdAt', 'updatedAt'],
//           },
//         },
//         {
//           model: Course,
//           attributes: {
//             exclude: ['createdAt', 'updatedAt'],
//           },
//         },
//         {
//           model: CourseUser,
//           attributes: {
//             exclude: ['createdAt', 'updatedAt'],
//           },
//         },
//         {
//           model: NotificationRead,
//           attributes: {
//             exclude: ['createdAt', 'updatedAt'],
//           },
//           separate: true,
//           nest: true,
//         },
//       ],
//       separate: true,
//       order: [['createdAt', 'DESC']],
//     })

//     res.status(200).json({
//       status: 'Success',
//       message: 'Sukses menampilkan data notifikasi',
//       data: notification,
//     })
//   } catch (err) {
//     next(new ApiError(err.message, 500))
//   }
// }

const getAllNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: Course,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: CourseUser,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: NotificationRead,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'Success',
      message: 'Sukses menampilkan data notifikasi',
      data: notification,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getNotifByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notification = await Notification.findAll({
      where: {
        [Op.or]: [
          {
            userId,
          },
          { userId: null },
        ],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: Course,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: CourseUser,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: NotificationRead,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Sukses menampilkan data notifikasi by user id',
      data: notification,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
const getDetailNotif = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notifId } = req.params;

    const notification = await Notification.findOne({
      where: {
        [Op.or]: [
          {
            userId,
          },
          { userId: null },
        ],
        id: notifId,
      },
    });

    if (!notification) { return next(new ApiError('Notifikasi tidak ditemukan', 404)); }

    const notificationRead = await NotificationRead.update(
      {
        isRead: true,
      },
      {
        where: {
          notifId,
        },
        returning: true,
      },
    );

    res.status(200).json({
      status: 'Success',
      message: 'Sukses menampilkan data by notifikasi id',
      data: {
        notification,
        notificationRead: notificationRead[1][0],
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// Notifikasi Login Member
// Notifikasi create course
// Notifikasi join course
// Notifikasi selesai menonton seluruh course
// Notifikasi mengubah password

module.exports = {
  getAllNotification,
  getNotifByUserId,
  getDetailNotif,
};
