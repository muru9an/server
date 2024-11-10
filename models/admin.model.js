module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Admin', {
      adminId: {
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
    }, {
        tableName: 'admin' 
      });
  };