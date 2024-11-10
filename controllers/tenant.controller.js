const db = require('../models');
const Tenant = db.Tenant;

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const { JWT_SECRET } = process.env; 

// Create a new tenant
exports.create = async (req, res) => {

    console.log("Reached "+req);
  try {
    const newTenant = await Tenant.create(req.body);
    res.status(201).send(newTenant);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all tenants
exports.findAll = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.status(200).send(tenants);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a single tenant by ID
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      return res.status(404).send({ message: 'Tenant not found' });
    }
    res.status(200).send(tenant);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a tenant by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Tenant.update(req.body, {
      where: { tenantId: id }
    });
    if (!updated) {
      return res.status(404).send({ message: 'Tenant not found' });
    }
    res.status(200).send({ message: 'Tenant updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a tenant by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Tenant.destroy({
      where: { tenantId: id }
    });
    if (!deleted) {
      return res.status(404).send({ message: 'Tenant not found' });
    }
    res.status(200).send({ message: 'Tenant deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.tenantLogin = async (req, res) => {
  const { tenantId, email } = req.body;
  console.log("Tenant login server called");
  try {
    // Validate that tenantId and email are provided
    if (!tenantId || !email) {
      return res.status(400).json({ message: 'Tenant ID and Email are required.' });
    }
    // Check if tenant exists
    const tenant = await Tenant.findOne({ where: { tenantId, email } });

    if (!tenant) {
      return res.status(401).json({ message: 'Invalid Tenant ID or Email.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ tenantId: tenant.tenantId, email: tenant.email }, JWT_SECRET, {
      expiresIn: '1h'  // Token expires in 1 hour
    });

    return res.status(200).json({
      message: 'Login successful',
      token,  
      tenant: {
        tenantId: tenant.tenantId,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

// Send OTP to tenant's email
exports.sendOTP = async (req, res) => {

  console.log("sendotp called");

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const tenant = await Tenant.findOne({ where: { email } });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await Tenant.update({ otp, otpExpiration }, { where: { email } });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tenant.email,
      subject: 'Your OTP for Login',
      text: `Hi ${tenant.firstName},\n\nYour OTP for login is: ${otp}. This OTP is valid for 10 minutes.\n\nBest Regards,\nYour Property Management Team`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email address.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const tenant = await Tenant.findOne({ where: { email } });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    if (tenant.otp !== otp || tenant.otpExpiration < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP.' });
    }

    const token = jwt.sign({ tenantId: tenant.tenantId, email: tenant.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    await Tenant.update({ otp: null, otpExpiration: null }, { where: { email } });

    res.status(200).json({
      message: 'Login successful',
      token,
      tenant: {
        tenantId: tenant.tenantId,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

