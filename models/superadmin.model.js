module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SuperAdmin', {
    superAdminId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'superadmin', // You can set a default value
    },
  }, {
    tableName: 'superadmin'
  });
};
