'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auth.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      })
    }
  }
  Auth.init(
    {
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Auth',
    }
  )
  return Auth
}
