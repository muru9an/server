// routes/superAdmin.routes.js
const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superadmin.controller');
const { verifySuperAdmin } = require('../middleware/auth');

// SuperAdmin registration and login
router.post('/register', superAdminController.registerSuperAdmin);
router.post('/login',superAdminController.loginSuperAdmin);

// Add Admin (only SuperAdmin can do this)
router.post('/addAdmin', verifySuperAdmin,superAdminController.addAdmin);

module.exports = router;
