const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');
const complaintController = require('../controllers/complaint.controller');

// Define routes and attach controller functions

// Person routes
router.post('/companies/:companyId/persons', personController.createPerson);  // Create a new person under a specific company
router.get('/companies/:companyId/persons', personController.getPersonsByCompanyId);  // Get persons by company ID
router.post('/persons', personController.createPerson);  // Create a new person
router.get('/persons', personController.getAllPersons);  // Get all persons
router.get('/persons/:id', personController.getPersonById);  // Get a person by ID
router.put('/persons/:id', personController.updatePerson);  // Update a person by ID
router.delete('/persons/:id', personController.deletePerson);  // Delete a person by ID

// Complaint routes
router.get('/complaints/email/:email', complaintController.getComplaintsByPersonEmail);  // Get complaints by person's email

// OTP-based login for Person
router.post('/persons/send-otp', personController.sendPersonOTP);  // Send OTP to a person's email
router.post('/persons/verify-otp', personController.verifyPersonOTP);  // Verify OTP and login

module.exports = router;
