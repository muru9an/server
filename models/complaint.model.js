module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define('Complaint', {
    complaintId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tenant',
        key: 'tenantId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    companyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Company',
        key: 'companyId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    propertyId: {
      type: DataTypes.INTEGER,  // New propertyId field to associate complaint with a property
      references: {
        model: 'Property',
        key: 'propertyId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    complaintText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved'),
      defaultValue: 'pending'
    },
    resolutionDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    charges: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    resolvedAt: {
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
    tableName: 'Complaint'
  });

  return Complaint;
};
