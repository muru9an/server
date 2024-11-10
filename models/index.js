const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import your models here
db.Company = require("./company.model.js")(sequelize, DataTypes);
db.Person = require("./person.model.js")(sequelize, DataTypes);
db.Property = require("./property.model.js")(sequelize, DataTypes);
db.Tenant = require("./tenant.model.js")(sequelize, DataTypes);
db.SuperAdmin = require("./superadmin.model.js")(sequelize, DataTypes);
db.Admin = require("./admin.model.js")(sequelize, DataTypes);
db.Transaction = require("./transaction.model.js")(sequelize, DataTypes);  
db.Complaint = require("./complaint.model.js")(sequelize, DataTypes);  


// Define associations here

db.Company.hasMany(db.Person, { foreignKey: 'companyId' });
db.Person.belongsTo(db.Company, { foreignKey: 'companyId' });

db.Company.hasMany(db.Property, { foreignKey: 'companyId' });
db.Property.belongsTo(db.Company, { foreignKey: 'companyId' });

db.Property.hasMany(db.Tenant, { foreignKey: 'propertyId' });
db.Tenant.belongsTo(db.Property, { foreignKey: 'propertyId' });


db.Tenant.hasMany(db.Transaction, { foreignKey: 'tenantId' });
db.Transaction.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Company.hasMany(db.Transaction, { foreignKey: 'companyId' });
db.Transaction.belongsTo(db.Company, { foreignKey: 'companyId' });

db.Tenant.hasMany(db.Complaint, { foreignKey: 'tenantId' });
db.Complaint.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Company.hasMany(db.Complaint, { foreignKey: 'companyId' });
db.Complaint.belongsTo(db.Company, { foreignKey: 'companyId' });

db.Property.hasMany(db.Transaction, { foreignKey: 'propertyId' });
db.Transaction.belongsTo(db.Property, { foreignKey: 'propertyId' });




module.exports = db;
