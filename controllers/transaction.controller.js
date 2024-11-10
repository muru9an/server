const { Tenant, Property, Company, Transaction, Complaint } = require('../models');


const { sequelize } = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

const transactionController = {
  // Get all companies
  async getAllCompanies(req, res) {
    try {
      const companies = await Company.findAll();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  },

  // Get properties by companyId
  async getPropertiesByCompanyId(req, res) {
    const { companyId } = req.params;
    try {
      const properties = await Property.findAll({
        where: { companyId }
      });
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  // Get tenant details by propertyId
  async getTenantsByPropertyId(req, res) {
    const { propertyId } = req.params;
    try {
      const tenants = await Tenant.findAll({
        where: { propertyId }
      });
      res.status(200).json(tenants);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tenants' });
    }
  },

  // Calculate total income and expenses for a tenant
  async calculateTotalsForTenant(req, res) {
    const { tenantId } = req.params;
    try {
      const transactions = await Transaction.findAll({
        where: { tenantId }
      });

      const totalIncome = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      const totalExpenses = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.complaintCharges), 0);

      res.status(200).json({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate totals' });
    }
  },


 

async getAllTransactions(req, res) {
  console.log("Reached Get All Transactions");

  const { tenantId } = req.query; // Get tenantId from query parameters
  const whereClause = tenantId ? { tenantId } : {}; // Add condition if tenantId is provided

  try {
    // Fetch transactions, possibly filtered by tenantId
    const transactions = await Transaction.findAll({ where: whereClause });
    
    // Log the entire array of transactions
   // console.log("Transactions: ", transactions);
    
    // Log complaintCharges for each transaction
    // transactions.forEach(transaction => {
    //   console.log("complaintCharges: ", transaction.complaintCharges);
    // });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

// In your TransactionService on the backend side
async getTotalsByProperty(req, res) {
  const propertyId = req.params.propertyId; // Extract the property ID
  console.log("Fetching totals for Property ID:", propertyId); // Log the property ID

  try {
    const totals = await Transaction.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalIncome'],
        [sequelize.fn('SUM', sequelize.col('complaintCharges')), 'totalExpenses']
      ],
      where: {
        propertyId: propertyId // Use the extracted propertyId here
      }
    });
   
    if (totals) {
      res.json(totals);
    } else {
      res.json({ totalIncome: null, totalExpenses: null, balance: 0 });
    }
  } catch (error) {
    console.error("Error fetching totals:", error);
    res.status(500).json({ message: 'Server error' });
  }
}

};

module.exports = transactionController;
