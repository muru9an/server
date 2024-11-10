module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    tenantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false // Ensures first name is required
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false // Ensures last name is required
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique
      validate: {
        isEmail: true // Validates email format
      }
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true // OTP field for verification
    },
    otpExpiration: {
      type: DataTypes.DATE,
      allowNull: true // Expiration date for OTP
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Optional phone number
      validate: {
        isNumeric: true, // Validates that phone number is numeric
        len: {
          args: [10, 15], // Validates phone number length
          msg: "Phone number must be between 10 and 15 digits."
        }
      }
    },
    rentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true // Optional rental amount
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Automatically set created date
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Automatically set updated date
    }
  }, {
    // Model options
    timestamps: true, // Enable timestamps for createdAt and updatedAt
    tableName: 'Tenant' // Optional: explicitly define the table name
  });

  return Tenant;
};
