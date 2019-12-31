/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password: '$2a$11$KBNfgGLo1VaLWHtD5QWcpOzs.32V.pUgmaBlK6VOgoiTAGjFsBWrW',
    signMethod: 'local',
    address: '17132 Conroy Cape',
    status: 'unverified',
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    firstName: 'Tyrese',
    lastName: 'Bergstrom',
    email: 'admin@quickcredit.com',
    password: '$2a$11$KBNfgGLo1VaLWHtD5QWcpOzs.32V.pUgmaBlK6VOgoiTAGjFsBWrW',
    signMethod: 'local',
    address: '660 Grady Summit',
    status: 'verified',
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
