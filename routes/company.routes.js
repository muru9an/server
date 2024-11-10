const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// CRUD routes for companies
router.post('/companies', companyController.create);
router.get('/companies', companyController.findAll);
router.get('/companies/:id', companyController.findOne);
router.put('/companies/:id', companyController.update);
router.delete('/companies/:id', companyController.delete);

module.exports = router;
