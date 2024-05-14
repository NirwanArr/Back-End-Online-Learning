/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const path = require('path');
// const { where } = require('sequelize');
const {
  User, Auth, Notification, NotificationRead,
} = require('../models');
const ApiError = require('../../utils/apiError');
const imagekit = require('../libs/imagekit');

const getUsers = async (req, res, next) => {
  try {
    const allUser = await User.findAll();
    res.status(200).json({
      status: 'Success',
      allUser,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getUserByEmail = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await Auth.findOne({
      where: { email },
      attributes: ['userId'],
    });
    if (!user) {
      return next(new ApiError('Pengguna tidak ditemukan', 404));
    }

    res.status(200).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// update User
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
    },
  });
  const userBody = req.body;
  const { file } = req;
  const condition = { where: { id }, returning: true };
  let image;

  try {
    if (!user) {
      return next(new ApiError('Pengguna tidak ditemukan', 404));
    }
    if (file) {
      const filename = file.originalname;
      const extension = path.extname(filename);
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      image = uploadedImage.url;
    }

    const updatedUser = await User.update({ ...userBody, image }, condition);

    res.status(200).json({
      status: 'success',
      message: `Pembaruan course sukses dengan id ${id}`,
      data: updatedUser[1][0],
    });
  } catch (err) {
    if (err.message.split(':')[0] === 'notNull Violation') {
      const errorMessage = err.message.split(':')[1].split('.')[1].split(',')[0];
      next(new ApiError(errorMessage, 400));
      return;
    }
    next(new ApiError(err.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return next(new ApiError('Pengguna dengan Id ini tidak ditemukan', 404));
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    await Auth.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: 'Success',
      message: 'Berhasil dihapus',
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Password tidak sesuai',
      });
    }

    // Cari data pengguna berdasarkan ID
    const user = await Auth.findOne({
      where: {
        userId,
      },
      include: ['User'],
    });

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        status: 'Gagal',
        message: 'Password lama tidak sesuai',
      });
    }
    // Hash password baru
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password di database Auth
    await Auth.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          userId,
        },
      },
    );

    // const notif = await Notification.create

    const notif = await Notification.create({
      titleNotification: 'Password',
      typeNotification: 'Notifikasi',
      description: 'Password Anda telah diperbarui',
      userId,
    });

    await NotificationRead.create({
      notifId: notif.id,
      userId,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Pembaruan Kata Sandi berhasil',
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  changePassword,
};
