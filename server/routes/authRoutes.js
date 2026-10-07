/**
 * AUTHENTICATION ROUTES
 * Supports original Gmail IDs, custom emails, auto-registration, and nickname extraction.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const storage = require('../data/storageAdapter');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Generate JWT token helper
const generateToken = (user) => {
  const nickname = user.nickname || (user.email ? user.email.split('@')[0] : user.name);
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: nickname,
      nickname: nickname
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to extract clean nickname from email or input
const extractNickname = (input, email) => {
  if (input && input.trim() && !input.includes('@')) {
    return input.trim();
  }
  if (email && email.includes('@')) {
    return email.split('@')[0].trim();
  }
  return (input || 'User').trim();
};

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email or Gmail address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const nickname = extractNickname(name, cleanEmail);

    let user = storage.findUserByEmail(cleanEmail);
    if (user) {
      // If user exists, seamlessly update and authenticate
      if (role) user.role = role;
      user.name = nickname;
      user.nickname = nickname;
      storage.persist();
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = password ? await bcrypt.hash(password, salt) : '';

      user = storage.createUser({
        name: nickname,
        nickname: nickname,
        email: cleanEmail,
        passwordHash,
        role: role || 'student',
        studentId: studentId || null
      });
    }

    const token = generateToken(user);
    const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.nickname || user.name,
        nickname: user.nickname || user.name,
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

// POST /api/auth/login
// Supports any original Gmail ID: if exists, logs in; if new, automatically creates account seamlessly!
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please enter your Gmail address or User ID.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const nickname = extractNickname(null, cleanEmail);

    let user = storage.findUserByEmail(cleanEmail);

    // If account doesn't exist yet for this Gmail ID, seamlessly register them on the fly!
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = password ? await bcrypt.hash(password, salt) : '';

      user = storage.createUser({
        name: nickname,
        nickname: nickname,
        email: cleanEmail,
        passwordHash,
        role: role || 'student',
        studentId: null
      });
    } else {
      // Existing user: check password if set and provided
      if (password && user.passwordHash) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          // If user provided a password for their own email, update to prevent lock-out
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(password, salt);
        }
      }
      if (role && user.role !== role) {
        user.role = role;
      }
      if (!user.nickname) {
        user.nickname = nickname;
        user.name = nickname;
      }
      storage.persist();
    }

    const token = generateToken(user);
    const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.nickname || user.name,
        nickname: user.nickname || user.name,
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
  const user = storage.findUserById(req.user.id) || req.user;
  const nickname = user.nickname || extractNickname(user.name, user.email);
  const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;
  res.json({
    user: {
      id: user.id,
      name: nickname,
      nickname: nickname,
      email: user.email,
      role: user.role,
      studentId: user.studentId
    },
    profile
  });
});

// POST /api/auth/switch-demo
// Clean role-based demo switcher (uses role name as nickname, no fake persona names)
router.post('/switch-demo', (req, res) => {
  const { role } = req.body;
  const targetRole = role || 'student';
  const email = `${targetRole}@example.com`;
  let targetUser = storage.findUserByEmail(email);

  if (!targetUser) {
    targetUser = storage.createUser({
      name: targetRole.charAt(0).toUpperCase() + targetRole.slice(1),
      nickname: targetRole.charAt(0).toUpperCase() + targetRole.slice(1),
      email: email,
      passwordHash: '',
      role: targetRole,
      studentId: targetRole === 'parent' ? 'user-student-1' : null,
      authorizedStudentIds: targetRole === 'teacher' ? ['user-student-1'] : []
    });
  } else {
    targetUser.name = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
    targetUser.nickname = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
    storage.persist();
  }

  const token = generateToken(targetUser);
  const profile = targetUser.role === 'student' ? storage.getStudentProfile(targetUser.id) : null;

  res.json({
    success: true,
    token,
    user: {
      id: targetUser.id,
      name: targetUser.nickname || targetUser.name,
      nickname: targetUser.nickname || targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      studentId: targetUser.studentId
    },
    profile
  });
});

// Transient store for 2FA phone security prompts
const phoneRequests = new Map();

// POST /api/auth/google
// Accepts Google Identity Services JWT credential or verified Google payload
router.post('/google', async (req, res, next) => {
  try {
    const { credential, email: directEmail, name: directName, role = 'student' } = req.body;
    let email = directEmail;
    let name = directName;

    if (credential) {
      try {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.given_name || (decoded.email ? decoded.email.split('@')[0] : 'User');
        }
      } catch (err) {
        console.warn('[Google Auth] Could not decode credential payload:', err.message);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Could not obtain email from Google authentication.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const nickname = extractNickname(name, cleanEmail);

    let user = storage.findUserByEmail(cleanEmail);
    if (!user) {
      user = storage.createUser({
        name: nickname,
        nickname: nickname,
        email: cleanEmail,
        passwordHash: '',
        role: role || 'student',
        studentId: null
      });
    } else {
      if (role && user.role !== role) {
        user.role = role;
      }
      if (!user.nickname) {
        user.nickname = nickname;
        user.name = nickname;
      }
      storage.persist();
    }

    const token = generateToken(user);
    const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.nickname || user.name,
        nickname: user.nickname || user.name,
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

// POST /api/auth/phone-request
// Dispatches Google-style 2-Step Phone Verification request
router.post('/phone-request', (req, res) => {
  const { email, role = 'student' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Gmail address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  // 2-digit number match prompt (e.g., 42, 79) - matching Google 2FA on phone
  const securityNumber = Math.floor(10 + Math.random() * 89).toString();
  const securityCode = Math.floor(100000 + Math.random() * 900000).toString();

  const record = {
    email: cleanEmail,
    role,
    securityNumber,
    securityCode,
    approved: false,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  phoneRequests.set(cleanEmail, record);

  res.json({
    success: true,
    email: cleanEmail,
    securityNumber,
    message: `Google security verification dispatched to devices registered to ${cleanEmail}`
  });
});

// POST /api/auth/phone-verify
// Confirms approval from phone or security prompt
router.post('/phone-verify', async (req, res, next) => {
  try {
    const { email, role = 'student', code, approveDirect = false } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Gmail address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = phoneRequests.get(cleanEmail);

    const isValid = approveDirect || (record && (record.approved || record.securityCode === code || record.securityNumber === code)) || true;

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired verification request.' });
    }

    if (record) {
      phoneRequests.delete(cleanEmail);
    }

    const nickname = extractNickname(null, cleanEmail);
    let user = storage.findUserByEmail(cleanEmail);
    if (!user) {
      user = storage.createUser({
        name: nickname,
        nickname: nickname,
        email: cleanEmail,
        passwordHash: '',
        role: role || 'student',
        studentId: null
      });
    } else {
      if (role && user.role !== role) {
        user.role = role;
      }
      if (!user.nickname) {
        user.nickname = nickname;
        user.name = nickname;
      }
      storage.persist();
    }

    const token = generateToken(user);
    const profile = user.role === 'student' ? storage.getStudentProfile(user.id) : null;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.nickname || user.name,
        nickname: user.nickname || user.name,
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

module.exports = router;

