const jwt = require('jsonwebtoken');

// Middleware to check if a user is authenticated
const requireAuth = (req, res, next) => {
  let token;

  // 1. Check for token in the Authorization header (Best practice for API)
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } 
  // 2. (Optional fallback) Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is found, deny access
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. Authorization token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set req.user to an object containing the ID. 
    // This allows the controller to access req.user._id safely.
    req.user = { _id: decoded.id }; 
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = requireAuth;