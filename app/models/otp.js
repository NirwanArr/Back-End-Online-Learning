'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OTP.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  OTP.init(
    {
      userId: DataTypes.INTEGER,
      code: DataTypes.STRING,
      expiredAt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OTP',
    }
  );
  return OTP;
};
