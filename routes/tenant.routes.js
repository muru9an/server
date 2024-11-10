const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

const { tenantLogin, sendOTP } = require('../controllers/tenant.controller');
const { verifyTenantToken } = require('../middleware/auth');  // Middleware for token verification
const { payRent, fileComplaint } = require('../controllers/tenantActions.controller');


// CRUD routes for tenants
router.post('/tenants', tenantController.create);
router.get('/tenants', tenantController.findAll);
router.get('/tenants/:id', tenantController.findOne);
router.put('/tenants/:id', tenantController.update);
router.delete('/tenants/:id', tenantController.delete);


// Tenant login route
router.post('/tenants/login', tenantLogin);

// Pay rent route (tenant must be logged in, so use token verification middleware)
router.post('/tenants/pay-rent', verifyTenantToken, payRent);

// File complaint route (tenant must be logged in)
router.post('/tenants/complaint', verifyTenantToken, fileComplaint);

router.post('/tenants/login/email/send-otp', sendOTP);

// Route to verify OTP and login
router.post('/tenants/login/email/verify-otp', tenantController.verifyOTP);

module.exports = router;
