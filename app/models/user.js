'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.hasOne(models.Auth, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.hasOne(models.OTP, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.hasMany(models.CourseUser, {
        foreignKey: 'userId',
        allowNull: false,
      })
      User.hasMany(models.Transaction, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.hasMany(models.Notification, {
        foreignKey: {
          name: 'userId',
        },
        as: 'notification',
      })
      User.hasMany(models.NotificationRead, {
        foreignKey: {
          name: 'userId',
        },
        as: 'notificationRead',
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(['admin', 'member']),
        defaultValue: 'member',
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          'https://tse2.mm.bing.net/th?id=OIP.U2iQ7wNK6ZzTW_traW_-PQHaHa&pid=Api&P=0&h=180',
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}
