'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        defaultValue:
          'https://ik.imagekit.io/xphqqd3ms/image(1).png?updatedAt=1701517286117',
        allowNull: false,
      },
      courseType: {
        type: Sequelize.ENUM(['Free', 'Premium']),
        allowNull: false,
      },
      telegramGroup: {
        type: Sequelize.STRING,
      },
      courseLevel: {
        type: Sequelize.ENUM(['Beginner', 'Intermediate', 'Advanced']),
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      aboutCourse: {
        type: Sequelize.TEXT,
      },
      intendedFor: {
        type: Sequelize.TEXT,
      },
      courseDiscountInPercent: {
        type: Sequelize.FLOAT,
        allowNull: false,
        default: 0,
      },
      coursePrice: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses')
  },
}
