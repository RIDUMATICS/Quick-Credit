/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Loans', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user: {
      type: Sequelize.STRING,
      references: {
        model: 'Users',
        key: 'email',
      },
    },
    createdOn: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['pending', 'approved', 'rejected'],
    },
    repaid: {
      type: Sequelize.BOOLEAN,
    },
    tenor: {
      type: Sequelize.INTEGER,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    paymentInstallment: {
      type: Sequelize.FLOAT,
    },
    balance: {
      type: Sequelize.FLOAT,
    },
    interest: {
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Loans'),
};
