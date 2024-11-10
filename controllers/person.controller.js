const db = require('../models');
const Person = db.Person;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env;

// Create a new person
exports.createPerson = async (req, res) => {

  console.log("Create Person Called!!!", JSON.stringify(req.body, null, 2));


  try {
    const newPerson = await Person.create(req.body);
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all persons
exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.findAll();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get person by ID
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (person) {
      res.status(200).json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPersonsByCompanyId = async (req, res) => {
  try {
    const persons = await db.Person.findAll({
      where: { companyId: req.params.companyId } // Filter by companyId
    });
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a person by ID
exports.updatePerson = async (req, res) => {
  try {
    const updated = await Person.update(req.body, {
      where: { personId: req.params.id }
    });
    if (updated[0]) {
      res.status(200).json({ message: 'Person updated' });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a person by ID
exports.deletePerson = async (req, res) => {
  try {
    const deleted = await Person.destroy({
      where: { personId: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Person deleted' });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate OTP function
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

// Send OTP to person's email
exports.sendPersonOTP = async (req, res) => {
  const { email } = req.body;
  console.log(" person otp reached "+email);
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const person = await Person.findOne({ where: { email } });

    if (!person) {
      return res.status(404).json({ message: 'Person not found.' });
    }

    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await Person.update({ otp, otpExpiration }, { where: { email } });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: person.email,
      subject: 'Your OTP for Login',
      text: `Hi ${person.firstName},\n\nYour OTP for login is: ${otp}. This OTP is valid for 10 minutes.\n\nBest Regards,\nYour Property Management Team`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email address.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify OTP and login
exports.verifyPersonOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const person = await Person.findOne({ where: { email } });

    if (!person) {
      return res.status(404).json({ message: 'Person not found.' });
    }

    if (person.otp !== otp || person.otpExpiration < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP.' });
    }

    const token = jwt.sign({ personId: person.personId, email: person.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    await Person.update({ otp: null, otpExpiration: null }, { where: { email } });

    res.status(200).json({
      message: 'Login successful',
      token,
      person: {
        personId: person.personId,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
