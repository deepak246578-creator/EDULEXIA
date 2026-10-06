/**
 * STUDENT ROUTES
 */

const express = require('express');
const router = express.Router();
const storage = require('../data/storageAdapter');
const { verifyToken } = require('../middleware/auth');

// GET /api/student/profile
router.get('/profile', verifyToken, (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : (req.query.studentId || req.user.studentId);
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID required.' });
  }

  const profile = storage.getStudentProfile(studentId);
  const attempts = storage.getScreeningAttemptsByStudent(studentId);
  const latestScreening = attempts[0] || null;

  res.json({
    success: true,
    profile,
    latestScreening
  });
});

// PUT /api/student/preferences
router.put('/preferences', verifyToken, (req, res) => {
  const studentId = req.user.id;
  const preferences = req.body;

  const updatedProfile = storage.updateStudentProfile(studentId, { preferences });
  res.json({
    success: true,
    preferences: updatedProfile?.preferences
  });
});

// GET /api/student/achievements
router.get('/achievements', verifyToken, (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : (req.query.studentId || req.user.studentId);
  const achievements = storage.getStudentAchievements(studentId);

  res.json({
    success: true,
    achievements
  });
});

// GET /api/student/progress
router.get('/progress', verifyToken, (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : (req.query.studentId || req.user.studentId);
  const profile = storage.getStudentProfile(studentId);
  const activityResults = storage.getActivityResultsByStudent(studentId);
  const attempts = storage.getScreeningAttemptsByStudent(studentId);

  // Group activity results by skill area
  const skillBreakdown = {};
  activityResults.forEach(res => {
    const act = storage.getActivityById(res.activityId);
    if (act) {
      if (!skillBreakdown[act.skillArea]) {
        skillBreakdown[act.skillArea] = { total: 0, count: 0, title: act.skillArea };
      }
      skillBreakdown[act.skillArea].total += res.percentage;
      skillBreakdown[act.skillArea].count += 1;
    }
  });

  const skillAverages = Object.entries(skillBreakdown).map(([key, val]) => ({
    skillArea: key,
    averageAccuracy: Math.round(val.total / val.count),
    activitiesCompleted: val.count
  }));

  res.json({
    success: true,
    profile,
    stats: {
      totalActivitiesCompleted: activityResults.length,
      starsCount: profile.starsCount || 0,
      streakDays: profile.streakDays || 1,
      currentLevel: profile.learningLevel || 1,
      totalScreenings: attempts.length,
      latestScreeningScore: attempts[0]?.screeningScore ?? null
    },
    skillAverages,
    recentActivityResults: activityResults.slice(0, 5),
    screeningHistory: attempts
  });
});

module.exports = router;
