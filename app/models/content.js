'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Content.belongsTo(models.Chapter, {
        foreignKey: {
          name: 'chapterId',
        },
      })
    }
  }
  Content.init(
    {
      contentTitle: DataTypes.STRING,
      contentUrl: DataTypes.STRING,
      duration: DataTypes.STRING,
      youtubeId: DataTypes.STRING,
      chapterId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Content',
    }
  )
  return Content
}
