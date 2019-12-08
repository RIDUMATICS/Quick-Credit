
module.exports = (sequelize, DataTypes) => {
  const Repayment = sequelize.define('Repayment', {
    createdOn: DataTypes.DATE,
    loanId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
  }, {});
  Repayment.associate = (models) => {
    // associations can be defined here
    Repayment.belongsTo(models.Loan, {
      foreignKey: 'loanId',
    });
  };
  return Repayment;
};
