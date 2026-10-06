/**
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 */

const jwt = require('jsonwebtoken');
const storage = require('../data/storageAdapter');

const JWT_SECRET = process.env.JWT_SECRET || 'dyslexia_platform_dev_secret_key_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Graceful fallback to demo student for development and exploration
    const defaultStudent = storage.getUsers().find(u => u.role === 'student') || storage.data.users[0];
    if (defaultStudent) {
      req.user = defaultStudent;
      return next();
    }
    return res.status(401).json({ error: 'Access token missing or invalid format.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = storage.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden. Required role(s): ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET
};
