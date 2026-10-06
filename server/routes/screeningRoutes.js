/**
 * SCREENING ROUTES
 */

const express = require('express');
const router = express.Router();
const storage = require('../data/storageAdapter');
const ScoringEngine = require('../engine/scoringEngine');
const { verifyToken } = require('../middleware/auth');

// GET /api/screening/stages
// Returns the 7-stage screening curriculum questions
router.get('/stages', (req, res) => {
  const stages = storage.getScreeningStages();
  res.json({
    success: true,
    stages
  });
});

// POST /api/screening/submit
// Evaluates 7-stage responses, computes score and skill profile, persists attempt
router.post('/submit', verifyToken, (req, res, next) => {
  try {
    const { stageResponses } = req.body;

    if (!stageResponses || typeof stageResponses !== 'object') {
      return res.status(400).json({ error: 'Please provide valid screening stage responses.' });
    }

    const evaluation = ScoringEngine.evaluateScreening(stageResponses);

    const savedAttempt = storage.saveScreeningAttempt({
      studentId: req.user.id,
      ...evaluation,
      responses: stageResponses
    });

    res.status(201).json({
      success: true,
      result: savedAttempt
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/screening/result/:id
// Get details of a single screening attempt
router.get('/result/:id', verifyToken, (req, res) => {
  const attempt = storage.getScreeningAttemptById(req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: 'Screening result not found.' });
  }

  // Authorization check: student themselves, their parent, or their teacher
  if (req.user.role === 'student' && attempt.studentId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to view this screening result.' });
  }

  res.json({
    success: true,
    result: attempt
  });
});

// GET /api/screening/history
// Returns chronological screening attempts for tracking progress & re-screening
router.get('/history', verifyToken, (req, res) => {
  let targetStudentId = req.user.id;

  if (req.user.role === 'parent' && req.user.studentId) {
    targetStudentId = req.user.studentId;
  } else if (req.user.role === 'teacher' && req.query.studentId) {
    targetStudentId = req.query.studentId;
  }

  const history = storage.getScreeningAttemptsByStudent(targetStudentId);

  res.json({
    success: true,
    studentId: targetStudentId,
    history
  });
});

module.exports = router;
