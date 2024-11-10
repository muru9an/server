// middleware/auth.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  console.error("JWT secret key is missing. Check your environment variables.");
  process.exit(1);  // Exit process if the secret key is missing
}

console.log("JWT Secret Key Loaded");

exports.verifySuperAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.superAdminId = decoded.superAdminId;
    next();
  });
};

exports.verifyTenantToken = (req, res, next) => {
  
console.log("hello")
  const token = req.headers.authorization?.split(" ")[1]; // Extract token properly

  console.log("Tenant Token "+token);

  if (!token) {
    return res.status(403).json({ message: 'No token provided. Access denied.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }

    // Store tenant info in req.tenant for further use
    req.tenant = {
      tenantId: decoded.tenantId,
      email: decoded.email
    };
    next();
  });
};
