'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CourseUser extends Model {
    static associate(models) {
      CourseUser.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      CourseUser.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
      })
      CourseUser.hasMany(models.Notification, {
        foreignKey: {
          name: 'courseUserId',
        },
        as: 'notification',
      })
    }
  }
  CourseUser.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      contentFinished: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      courseStatus: {
        type: DataTypes.ENUM(['inProgress', 'Selesai']),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CourseUser',
    }
  )
  return CourseUser
}
