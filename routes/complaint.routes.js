const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');  

// Route to fetch tenant complaints
router.get('/complaints', complaintController.getComplaints);
router.put('/complaints/:complaintId',complaintController.resolveComplaint);

module.exports = router;
