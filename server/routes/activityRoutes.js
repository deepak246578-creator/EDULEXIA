/**
 * LEARNING ACTIVITY ROUTES
 */

const express = require('express');
const router = express.Router();
const storage = require('../data/storageAdapter');
const { verifyToken } = require('../middleware/auth');

// GET /api/activities
// Retrieve available activities with optional filtering by level or skillArea
router.get('/', (req, res) => {
  const { level, skillArea } = req.query;
  const activities = storage.getLearningActivities({ level, skillArea });

  res.json({
    success: true,
    count: activities.length,
    activities
  });
});

// GET /api/activities/:id
// Get a specific activity for practice
router.get('/:id', (req, res) => {
  const activity = storage.getActivityById(req.params.id);
  if (!activity) {
    return res.status(404).json({ error: 'Learning activity not found.' });
  }

  res.json({
    success: true,
    activity
  });
});

// POST /api/activities/:id/submit
// Submit completed practice activity, record score, award stars and streak
router.post('/:id/submit', verifyToken, (req, res, next) => {
  try {
    const { score, maxScore, attempts } = req.body;
    const activity = storage.getActivityById(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    const result = storage.saveActivityResult({
      studentId: req.user.id,
      activityId: activity.id,
      score: score || 0,
      maxScore: maxScore || 1,
      attempts: attempts || 1
    });

    const updatedProfile = storage.getStudentProfile(req.user.id);

    res.json({
      success: true,
      result,
      profile: {
        starsCount: updatedProfile.starsCount,
        streakDays: updatedProfile.streakDays,
        learningLevel: updatedProfile.learningLevel
      },
      message: 'Great practice session! Stars added to your profile.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
