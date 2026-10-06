/**
 * PARENT DASHBOARD ROUTES
 */

const express = require('express');
const router = express.Router();
const storage = require('../data/storageAdapter');
const recommendationService = require('../engine/recommendationEngine');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/parent/student
// Get comprehensive overview of the linked student
router.get('/student', verifyToken, requireRole('parent'), (req, res) => {
  let studentId = req.user.studentId || req.query.studentId;
  if (!studentId) {
    const defaultStudent = storage.getUsers().find(u => u.role === 'student');
    studentId = defaultStudent ? defaultStudent.id : 'user-student-1';
  }

  const studentUser = storage.findUserById(studentId);
  const profile = storage.getStudentProfile(studentId);
  const screeningAttempts = storage.getScreeningAttemptsByStudent(studentId);
  const activityResults = storage.getActivityResultsByStudent(studentId);
  const achievements = storage.getStudentAchievements(studentId);
  const recommendations = recommendationService.getRecommendationsForStudent(studentId);

  // Latest screening attempt
  const latestScreening = screeningAttempts[0] || null;

  // Enrich recent activity results with activity details
  const enrichedResults = activityResults.slice(0, 10).map(r => {
    const act = storage.getActivityById(r.activityId);
    return {
      ...r,
      title: act?.title || 'Reading Practice',
      skillArea: act?.skillArea,
      level: act?.level
    };
  });

  res.json({
    success: true,
    student: {
      id: studentUser ? studentUser.id : studentId,
      name: studentUser ? studentUser.name : 'Linked Student',
      email: studentUser?.email
    },
    profile,
    latestScreening,
    screeningHistory: screeningAttempts,
    recentActivityResults: enrichedResults,
    achievements,
    recommendations,
    disclaimer: 'This screening result is for educational guidance and practice recommendations only. It is NOT a medical diagnosis of dyslexia or any learning disability.'
  });
});

module.exports = router;
