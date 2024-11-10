const { Tenant, Property, Company, Transaction, Complaint } = require('../models');  // Import Tenant model

// Mock function for rent payment
const payRent = async (req, res) => {
  const { tenantId } = req.tenant;  // tenantId from verified JWT token
  const { amount } = req.body;  // Rent amount
  console.log("Amount " + amount);

  try {
    // Verify that the amount is provided and valid
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Valid rent amount is required.' });
    }

    // Find the tenant by tenantId
    const tenant = await Tenant.findByPk(tenantId, {
      include: [{ model: Property, include: [Company] }]  // Include linked Property and Company
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const companyId = tenant.Property?.Company?.companyId;

    const propertyId = tenant.Property?.propertyId;

    // Check if the company is linked
    if (!companyId || !propertyId) {
      return res.status(400).json({ message: 'Tenant is not associated with a company.' });
    }

    console.log("Property Id "+propertyId);

    // Update the rentAmount field in the tenant's record
    tenant.rentAmount = amount;
    await tenant.save();

    // Create a transaction record
    const transaction = await Transaction.create({
      tenantId: tenantId,
      companyId: companyId,
      propertyId: propertyId,
      amount: amount,
      paymentDate: new Date()
    });

    // Return success message with payment and tenant details
    return res.status(200).json({
      message: `Rent of ${amount} paid successfully for tenant ID ${tenantId}.`,
      tenantDetails: tenant,
      transactionDetails: transaction  // Include transaction details in the response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing rent payment.' });
  }
};


const fileComplaint = async (req, res) => {
  const { tenantId } = req.tenant;  // tenantId from verified JWT token
  const { complaintText } = req.body;  // Complaint text submitted by the tenant

  console.log("Complaint text "+" "+tenantId+" "+complaintText);

  try {
    // Validate complaintText
    if (!complaintText || complaintText.trim() === "") {
      return res.status(400).json({ message: 'Complaint text is required.' });
    }

    // Find the tenant and the associated company
    const tenant = await Tenant.findByPk(tenantId, {
      include: [{ model: Property, include: [Company] }]
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const companyId = tenant.Property?.Company?.companyId;
    const propertyId = tenant.Property?.propertyId;

    if (!companyId || !propertyId) {
      return res.status(400).json({ message: 'Tenant is not associated with a company.' });
    }

    // Save complaint in Complaints table
    const complaint = await Complaint.create({
      tenantId: tenantId,
      companyId: companyId,
      propertyId : propertyId,
      complaintText: complaintText
    });

    return res.status(200).json({
      message: 'Complaint filed successfully.',
      complaintDetails: complaint
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error filing complaint.' });
  }
};


const viewComplaints = async (req, res) => {
  const { companyId } = req.params;  // Company ID from request params

  try {
    // Find complaints linked to the company
    const complaints = await Complaint.findAll({
      where: { companyId: companyId },
      include: [{ model: Tenant }]
    });

    if (complaints.length === 0) {
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


module.exports = {
  payRent,
  fileComplaint,
  viewComplaints
};
