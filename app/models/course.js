'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'courseBy',
      })
      Course.belongsTo(models.Category, {
        foreignKey: {
          name: 'categoryId',
          allowNull: false,
        },
        as: 'category',
      })
      Course.hasMany(models.Chapter, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
        as: 'chapters',
      })
      Course.hasMany(models.Transaction, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
      Course.hasMany(models.CourseUser, {
        foreignKey: 'courseId',
        allowNull: false,
      })
      Course.hasMany(models.Notification, {
        foreignKey: {
          name: 'courseId',
        },
        as: 'notification',
      })
    }
  }
  Course.init(
    {
      courseCode: { type: DataTypes.STRING, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseName: { type: DataTypes.STRING, allowNull: false },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          'https://ik.imagekit.io/xphqqd3ms/image(1).png?updatedAt=1701517286117',
      },
      courseType: {
        type: DataTypes.ENUM(['Free', 'Premium']),
        allowNull: false,
      },
      telegramGroup: {
        type: DataTypes.STRING,
      },
      courseLevel: {
        type: DataTypes.ENUM(['Beginner', 'Intermediate', 'Advanced']),
        allowNull: false,
        defaultValue: 0.0,
      },
      rating: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      aboutCourse: { type: DataTypes.TEXT },
      intendedFor: { type: DataTypes.TEXT },
      courseDiscountInPercent: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      coursePrice: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Course',
    }
  )
  return Course
}
