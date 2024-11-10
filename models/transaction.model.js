module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transactionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      type: DataTypes.INTEGER,
      references: {
        model: 'Property',
        key: 'propertyId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    complaintCharges: {
      type: DataTypes.DECIMAL(10, 2),  
      allowNull: true,
      defaultValue: 0.00
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'Transaction'
  });

  return Transaction;
};
