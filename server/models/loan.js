
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    user: DataTypes.STRING,
    createdOn: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'approved', 'rejected'],
    },
    repaid: DataTypes.BOOLEAN,
    tenor: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    paymentInstallment: DataTypes.FLOAT,
    balance: DataTypes.FLOAT,
    interest: DataTypes.FLOAT,
  }, {});
  Loan.associate = (models) => {
    // associations can be defined here
    Loan.belongsTo(models.User, {
      foreignKey: 'user',
      targetKey: 'email',
    });
  };
  return Loan;
};
