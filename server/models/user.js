
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['unverified', 'verified'],
    },
    isAdmin: DataTypes.BOOLEAN,
  }, {});
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Loan, {
      foreignKey: 'user',
      sourceKey: 'email',
    });
  };
  return User;
};
