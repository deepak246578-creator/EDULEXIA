/**
 * TEACHER DASHBOARD ROUTES
 */

const express = require('express');
const router = express.Router();
const storage = require('../data/storageAdapter');
const recommendationService = require('../engine/recommendationEngine');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/teacher/students
// List authorized students and their screening & learning summaries
router.get('/students', verifyToken, requireRole('teacher'), (req, res) => {
  const authorizedIds = req.user.authorizedStudentIds || ['user-student-1'];

  const studentsData = authorizedIds.map(studentId => {
    const studentUser = storage.findUserById(studentId);
    const profile = storage.getStudentProfile(studentId);
    const screeningAttempts = storage.getScreeningAttemptsByStudent(studentId);
    const activityResults = storage.getActivityResultsByStudent(studentId);
    const recommendations = recommendationService.getRecommendationsForStudent(studentId);

    const latestScreening = screeningAttempts[0] || null;

    return {
      id: studentId,
      name: studentUser ? studentUser.name : 'Authorized Student',
      email: studentUser ? studentUser.email : null,
      learningLevel: profile.learningLevel || 1,
      starsCount: profile.starsCount || 0,
      streakDays: profile.streakDays || 1,
      lastPracticeDate: profile.lastPracticeDate,
      latestScreeningScore: latestScreening ? latestScreening.screeningScore : null,
      latestScreeningDate: latestScreening ? latestScreening.date : null,
      supportLevel: latestScreening ? latestScreening.supportLevel : 'Not Screened',
      skillProfile: latestScreening ? latestScreening.skillProfile : null,
      supportAreas: latestScreening ? latestScreening.supportAreas : [],
      totalActivitiesCompleted: activityResults.length,
      recommendationsSummary: recommendations.primaryActivity?.title || 'Initial Assessment'
    };
  });

  res.json({
    success: true,
    teacher: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    },
    students: studentsData
  });
});

// GET /api/teacher/student/:id/detail
// Full detailed drilldown for an authorized student
router.get('/student/:id/detail', verifyToken, requireRole('teacher'), (req, res) => {
  const studentId = req.params.id;
  const authorizedIds = req.user.authorizedStudentIds || ['user-student-1'];

  if (!authorizedIds.includes(studentId)) {
    return res.status(403).json({ error: 'You are not authorized to view this student\'s records.' });
  }

  const studentUser = storage.findUserById(studentId);
  const profile = storage.getStudentProfile(studentId);
  const screeningAttempts = storage.getScreeningAttemptsByStudent(studentId);
  const activityResults = storage.getActivityResultsByStudent(studentId);
  const achievements = storage.getStudentAchievements(studentId);
  const recommendations = recommendationService.getRecommendationsForStudent(studentId);

  res.json({
    success: true,
    student: {
      id: studentId,
      name: studentUser ? studentUser.name : 'Student',
      email: studentUser ? studentUser.email : null
    },
    profile,
    latestScreening: screeningAttempts[0] || null,
    screeningHistory: screeningAttempts,
    activityResults: activityResults.slice(0, 15),
    achievements,
    recommendations,
    disclaimer: 'This screening result is for educational guidance and practice recommendations only. It is NOT a medical diagnosis of dyslexia or any learning disability.'
  });
});

module.exports = router;
