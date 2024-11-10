const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');

// CRUD routes for properties
router.post('/properties', propertyController.create);
router.get('/properties', propertyController.findAll);
router.get('/properties/:id', propertyController.findOne);
router.put('/properties/:id', propertyController.update);
router.delete('/properties/:id', propertyController.delete);

module.exports = router;
