'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
      })
      Notification.belongsTo(models.Course, {
        foreignKey: 'courseId',
      })
      Notification.belongsTo(models.CourseUser, {
        foreignKey: 'courseUserId',
      })
      Notification.hasOne(models.NotificationRead, {
        foreignKey: { name: 'notifId' },
      })
    }
  }
  Notification.init(
    {
      titleNotification: { type: DataTypes.STRING, allowNull: false },
      typeNotification: {
        type: DataTypes.ENUM(['Notifikasi', 'Promosi']),
        allowNull: false,
      },
      description: { type: DataTypes.STRING, allowNull: false },
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      courseUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  )
  return Notification
}
