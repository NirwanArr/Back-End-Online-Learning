'use strict'

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { User } = require('../../app/models');

dotenv.config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'adminc8',
        phoneNumber: '+628236576342564',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'admin',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'member c8',
        phoneNumber: '08123276319',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'member',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'member2 c8',
        phoneNumber: '08123276319',
        country: 'Indonesia',
        city: 'Jakarta',
        role: 'member',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const adminPassword = process.env.PASSWORD_HASH;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(adminPassword, saltRounds);

    const users = await User.findAll();

    await queryInterface.bulkInsert('Auths', [
      {
        email: 'adminc8@mail.com',
        password: hashedPassword,
        userId: 1,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'memberc8@mail.com',
        password: hashedPassword,
        userId: users[1].id,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'member2c8@mail.com',
        password: hashedPassword,
        userId: users[1].id,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Auths', null, {});
  },
};
