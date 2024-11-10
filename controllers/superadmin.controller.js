// controllers/superAdmin.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const SuperAdmin = db.SuperAdmin;


const secretKey = process.env.JWT_SECRET;

exports.registerSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = await SuperAdmin.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'SuperAdmin registered successfully', superAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error registering SuperAdmin', error });
  }
};

exports.loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const superAdmin = await SuperAdmin.findOne({ where: { email } });

    console.log('SuperAdmin Object:', superAdmin); // Check the entire object
    console.log('Role:', superAdmin ? superAdmin.role : 'No super admin found'); // Check the role


    if (!superAdmin || !(await bcrypt.compare(password, superAdmin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token with superAdminId and role
    const token = jwt.sign(
      { 
        superAdminId: superAdmin.superAdminId,
        role: superAdmin.role // Include the role here
      }, 
      secretKey, 
      { expiresIn: '1h' }
    );
    
    res.json({ message: 'SuperAdmin logged in', token });
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
