const db = require('../models');
const Company = db.Company;

// Create a new company
exports.create = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).send(newCompany);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all companies
exports.findAll = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a single company by ID
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).send({ message: 'Company not found' });
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a company by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Company.update(req.body, {
      where: { companyId: id }
    });
    if (!updated) {
      return res.status(404).send({ message: 'Company not found' });
    }
    res.status(200).send({ message: 'Company updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a company by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Company.destroy({
      where: { companyId: id }
    });
    if (!deleted) {
      return res.status(404).send({ message: 'Company not found' });
    }
    res.status(200).send({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
