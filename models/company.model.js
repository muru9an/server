module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Company', {
    companyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contactEmail: {
      type: DataTypes.STRING
    },
    contactPhone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    tableName: 'Company'
  });
};
