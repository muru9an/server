const { Tenant, Company, Person, Complaint, Transaction } = require('../models');  // Import the models

// Fetch tenant complaints for company directors, secretaries, or shareholders
const getComplaints = async (req, res) => {
  try {
    // Assuming that req.user contains information about the logged-in user
    const userId = req.user.id;
    
    // Find out if the logged-in user is a director, secretary, or shareholder
    const person = await Person.findOne({
      where: {
        id: userId,
        role: ['director', 'secretary', 'shareholder']  // Ensure role is appropriate
      }
    });

    if (!person) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to view complaints.' });
    }

    // Fetch the complaints from the Tenant model for the associated company
    const complaints = await Tenant.findAll({
      where: {
        complaint: {
          [Op.ne]: null // Only fetch complaints that are not null
        }
      },
      include: [
        {
          model: Company,
          as: 'company',
          where: {
            companyId: person.companyId  // Only fetch complaints for the current company
          }
        }
      ],
      attributes: ['firstName', 'lastName', 'complaint', 'createdAt']  // Only select necessary fields
    });

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found.' });
    }

    res.status(200).json(complaints);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
};

const resolveComplaint = async (req, res) => {
  const { complaintId } = req.params;  // Complaint ID from request params
  const { resolutionDetails, charges } = req.body;  // Charges and resolution details from request body

  console.log("Resolve "+complaintId+" "+resolutionDetails+" "+charges+" "+req.body);

  try {
    // Find the complaint by its ID
    const complaint = await Complaint.findByPk(complaintId);
    console.log("Primary key "+complaint);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (complaint.status === 'resolved') {
      return res.status(400).json({ message: 'This complaint has already been resolved.' });
    }

    // Update the complaint with resolution details and charges
    complaint.resolutionDetails = resolutionDetails || 'No details provided';
    complaint.charges = charges || 0.00;
    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();  // Store the date of resolution

    await complaint.save();

    console.log("Property Id "+complaint.propertyId);
    // Find the related transaction using tenantId, companyId, and propertyId
    const transaction = await Transaction.findOne({
      where: {
        tenantId: complaint.tenantId,
        companyId: complaint.companyId,
        propertyId: complaint.propertyId  // Ensure we are linking the right property
      }
    });

    // If a transaction is found, update the complaintCharges field
    if (transaction) {
      transaction.complaintCharges = complaint.charges;  // Update the transaction with the complaint charges
      await transaction.save();
    } else {
      return res.status(404).json({ message: 'No related transaction found for this complaint.' });
    }

    return res.status(200).json({
      message: 'Complaint resolved successfully, and transaction updated.',
      complaintDetails: complaint,
      transactionDetails: transaction  // Return the updated transaction details
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error resolving the complaint.' });
  }
};




const viewCompanyComplaints = async (req, res) => {
  const { companyId } = req.params;  // Company ID from request params

  try {
    // Find all complaints for the company, including resolved and pending
    const complaints = await Complaint.findAll({
      where: { companyId: companyId },
      include: [{ model: Tenant }],
      order: [['createdAt', 'DESC']]
    });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this company.' });
    }

    return res.status(200).json({
      message: 'Complaints retrieved successfully.',
      complaints: complaints
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving complaints.' });
  }
};

const getComplaintsByPersonEmail = async (req, res) => {
  try {
    // Step 1: Get the person's details using their email
    const person = await Person.findOne({ where: { email: req.params.email } });
    
    // Check if the person was found
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Step 2: Get the company ID associated with the person
    const companyId = person.companyId;
    
    // Step 3: Get all complaints associated with the person's company
    const complaints = await Complaint.findAll({ where: { companyId: companyId } });
    
    // Check if there are complaints found
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this company" });
    }

    // Step 4: Send the complaints back as a response
    res.status(200).json(complaints);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getComplaints,
  resolveComplaint, 
  viewCompanyComplaints,
  getComplaintsByPersonEmail 
};