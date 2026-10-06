/**
 * AUTHENTICATION ROUTES
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const storage = require('../data/storageAdapter');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Generate JWT token helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = storage.createUser({
      name,
      email,
      passwordHash,
      role: role || 'student',
      studentId: studentId || null
    });

    const token = generateToken(newUser);
    const profile = newUser.role === 'student' ? storage.getStudentProfile(newUser.id) : null;

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId
      },
      profile
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const user = storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      },
      profile
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const profile = req.user.role === 'student' ? storage.getStudentProfile(req.user.id) : null;
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      studentId: req.user.studentId
    },
    profile
  });
});

// POST /api/auth/switch-demo
// Frictionless role switcher for demonstration and paired review
router.post('/switch-demo', (req, res) => {
  const { role } = req.body;
  let targetUser = null;

  if (role === 'parent') {
    targetUser = storage.findUserByEmail('parent@example.com');
  } else if (role === 'teacher') {
    targetUser = storage.findUserByEmail('teacher@example.com');
  } else {
    targetUser = storage.findUserByEmail('student@example.com');
  }

  if (!targetUser) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }

  const token = generateToken(targetUser);
  const profile = targetUser.role === 'student' ? storage.getStudentProfile(targetUser.id) : null;

  res.json({
    success: true,
    token,
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      studentId: targetUser.studentId
    },
    profile
  });
});

module.exports = router;
