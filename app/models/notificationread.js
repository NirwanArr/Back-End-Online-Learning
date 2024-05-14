'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class NotificationRead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NotificationRead.belongsTo(models.Notification, {
        foreignKey: 'notifId',
      })
      NotificationRead.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  NotificationRead.init(
    {
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      notifId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'NotificationRead',
    }
  )
  return NotificationRead
}
