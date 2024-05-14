'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
    }
  }
  Transaction.init(
    {
      orderId: DataTypes.INTEGER,
      courseName: DataTypes.STRING,
      ppn: DataTypes.FLOAT,
      price: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      paymentStatus: {
        type: DataTypes.ENUM(['paid', 'unpaid']),
        defaultValue: 'unpaid',
      },
      paymentMethod: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      linkPayment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Transaction',
    }
  )
  return Transaction
}
