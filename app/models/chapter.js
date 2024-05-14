'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
      Chapter.belongsTo(models.Course, {
        foreignKey: 'courseId',
      })
      Chapter.hasMany(models.Content, {
        foreignKey: {
          name: 'chapterId',
        },
        as: 'contents',
      })
    }
  }
  Chapter.init(
    {
      chapterTitle: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Chapter',
    }
  )
  return Chapter
}
