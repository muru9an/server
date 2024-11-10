module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Person', {
    personId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Company',
        key: 'companyId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
    },
    nationality: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM('director', 'secretary', 'shareholder'),
      allowNull: false
    },
    email: {  // Email field for OTP login
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    otp: {  // Field for storing OTP
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpiration: {  // Field for storing OTP expiration time
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'Person'
  });
};
