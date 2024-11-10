const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Route to get all companies
router.get('/companies', transactionController.getAllCompanies);

// Route to get properties by companyId
router.get('/properties/:companyId', transactionController.getPropertiesByCompanyId);

// Route to get tenant details by propertyId
router.get('/tenants/:propertyId', transactionController.getTenantsByPropertyId);

// Route to calculate total income and expenses for a tenant
router.get('/totals/:tenantId', transactionController.calculateTotalsForTenant);

// // Route to calculate total income and expenses for a property
 router.get('/totals/property/:propertyId', transactionController.getTotalsByProperty);

// // Route to calculate total income and expenses for a company
// router.get('/totals/company/:companyId', transactionController.getTotalsByCompany);

router.get('/tenant', transactionController.getAllTransactions);

// // Add this route in your backend transaction router
// router.get('/totals/company/:companyId', transactionController.getTotalsByCompany);


module.exports = router;
