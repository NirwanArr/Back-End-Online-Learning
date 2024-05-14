'use strict'

const { User } = require('../../app/models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        categoryName: 'UI/UX Design',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735373080._AHX82eu7S.jpeg?updatedAt=1701735376494',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Web Development',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735496898._zmBLMJx9E.jpeg?updatedAt=1701735500597',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Data Science',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735530599._SaDVh2c2g.jpeg?updatedAt=1701735533852',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Android Development',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735564320._8NY5we_7t.jpeg?updatedAt=1701735567581',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'Product Management',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1701735786642._-fTpdTNwR.jpeg?updatedAt=1701735789863',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryName: 'IOS Development',
        image:
          'https://ik.imagekit.io/AliRajab03/IMG-1702098391948._DmrOW5SvI.jpeg?updatedAt=1702098394632',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  },
}
