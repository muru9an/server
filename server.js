
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const companyRoutes = require('./routes/company.routes');
const propertyRoutes = require('./routes/property.routes');
const tenantRoutes = require('./routes/tenant.routes');
const personRoutes = require('./routes/person.routes');
const superAdminRoutes = require('./routes/superadmin.routes');
const adminRoutes = require('./routes/admin.routes');
const complaintRoutes = require('./routes/complaint.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.use(cors());

app.use(bodyParser.json());



// Register routes
app.use('/api', companyRoutes);
app.use('/api', propertyRoutes);
app.use('/api', tenantRoutes);
app.use('/api', personRoutes);
app.use('/api', complaintRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log("Database synced.");
  
  app.listen(3001, () => {
    console.log('Server is running on port 3001.');
  });
}).catch(err => {
  console.error('Failed to sync database:', err.message);
});
