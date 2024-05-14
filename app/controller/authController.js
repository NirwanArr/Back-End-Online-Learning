/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Auth, User, OTP, Notification, NotificationRead,
} = require('../models');
const generatedOTP = require('../../utils/generatedOTP');

const { AUTH_EMAIL } = process.env;
const sendEmail = require('../../utils/sendEmail');

const ApiError = require('../../utils/apiError');
const scheduleOtpDeletion = require('../../utils/scheduleDeletion');

const register = async (req, res, next) => {
  try {
    const {
      name, email, password, phoneNumber, country, city,
    } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return next(new ApiError('Email pengguna sudah digunakan', 400));
    }

    const passwordLength = password.length < 8;
    if (passwordLength) {
      return next(
        new ApiError('Panjang kata sandi minimal harus 8 karakter', 400),
      );
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      name,
      phoneNumber,
      country,
      city,
    });
    await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    const newCode = await generatedOTP();
    const expirationTime = new Date();
    const expirationInMinutes = 3;
    expirationTime.setMinutes(expirationTime.getMinutes() + expirationInMinutes);
    const expirationInMinutesSinceNow = Math.floor(
      (expirationTime - new Date()) / (1000 * 60),
    );

    const hasheOtpCode = bcrypt.hashSync(newCode, saltRounds);

    const newOTP = await OTP.create({
      code: hasheOtpCode,
      userId: newUser.id,
      expiredAt: expirationInMinutesSinceNow,
    });

    const deletionDelay = expirationInMinutesSinceNow * 60 * 1000;
    scheduleOtpDeletion(newOTP.id, deletionDelay);

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: `OTP from ${AUTH_EMAIL}`,
      html: `
                <p>Hello,</p>
                <p>Your OTP is:</p>
                <p style="color:black;font-size:25px;letter-spacing:2px;"><strong>${newCode}</strong></p>
                <p>It will expire in ${newOTP.expiredAt} minutes.</p>
                <p>Best regards,</p>
                <p>Team c8</p>
            `,
    };
    await sendEmail(mailOptions);

    res.status(201).json({
      status: 'Registrasi berhasil',
      data: {
        email,
        ...newUser,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    });

    if (!user) {
      return next(new ApiError('Email tidak ditemukan', 404));
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
      );
      if (user.verified !== true) {
        return next(new ApiError('Pengguna belum diverifikasi', 401));
      }

      const notif = await Notification.create({
        titleNotification: 'Login',
        typeNotification: 'Notifikasi',
        description: 'Selamat datang di Ascent',
        userId: user.userId,
      });
      await NotificationRead.create({
        userId: notif.userId,
        notifId: notif.id,
      });

      res.status(200).json({
        status: 'Success',
        message: 'Login berhasil',
        data: {
          token,
          id: user.userId,
          name: user.User.name,
          email: user.email,
        },
      });
    } else {
      return next(new ApiError('Kata sandi salah', 401));
    }
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    });

    if (!user) {
      return next(new ApiError('Email tidak ditemukan', 404));
    }

    if (user.User.role !== 'admin') {
      return next(new ApiError('Hanya admin yang dapat login', 401));
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
      );

      res.status(200).json({
        status: 'Success',
        message: 'Berhasil login',
        data: token,
      });
    } else {
      return next(new ApiError('Kata sandi salah', 401));
    }
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const authenticate = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'Success',
      data: {
        id: req.user.id,
        name: req.user.name,
        image: req.user.image,
        phoneNumber: req.user.phoneNumber,
        country: req.user.country,
        city: req.user.city,
        email: req.user.Auth.email,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const updateNewPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const users = await Auth.findOne({
      where: {
        userId,
      },
      include: ['User'],
    });

    if (users.verified !== true) {
      return next(new ApiError('Pengguna belum diverifikasi', 401));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

    // notifikasi
    const notif = await Notification.create({
      titleNotification: 'Login',
      typeNotification: 'Notifikasi',
      description: 'Password Anda telah diperbarui',
      userId,
    });
    await NotificationRead.create({
      userId,
      notifId: notif.id,
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
  register,
  login,
  authenticate,
  updateNewPassword,
  authenticateAdmin,
};
