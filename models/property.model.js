module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    propertyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Company',  // Use the model name as defined in Sequelize
        key: 'companyId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Adding unique constraint
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('residential', 'commercial'),
      allowNull: false
    },
    bedrooms: {
      type: DataTypes.INTEGER
    },
    bathrooms: {
      type: DataTypes.INTEGER
    },
    size: {
      type: DataTypes.DECIMAL(10, 2)
    },
    purchaseDate: {
      type: DataTypes.DATE
    },
    value: {
      type: DataTypes.DECIMAL(15, 2)
    },
    rent: {
      type: DataTypes.DECIMAL(10, 2)
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
    tableName: 'Property'
  });

  return Property;
};
