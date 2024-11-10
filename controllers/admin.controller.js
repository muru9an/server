// controllers/admin.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Admin = db.Admin; // Ensure this is your Admin model
const secretKey = process.env.JWT_SECRET;

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword }); // Create Admin instead of SuperAdmin
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error registering Admin', error });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });

    // Log the admin object correctly
    console.log('Admin Object:', admin); // Check the entire object
    console.log('Role:', admin ? admin.role : 'No admin found'); // Check the role

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token with adminId and role
    const token = jwt.sign(
      { 
        adminId: admin.adminId,
        role: admin.role // Include the role here
      }, 
      secretKey, 
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'Admin logged in', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.addAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'Admin added successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error adding Admin', error });
  }
};
