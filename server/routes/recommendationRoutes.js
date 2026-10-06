/**
 * RECOMMENDATION ROUTES
 */

const express = require('express');
const router = express.Router();
const recommendationService = require('../engine/recommendationEngine');
const { verifyToken } = require('../middleware/auth');

// GET /api/recommendations
// Returns personalized learning path, prioritized activities, and adaptive progression guidance
router.get('/', verifyToken, (req, res, next) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : (req.query.studentId || req.user.studentId);
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID required.' });
    }

    const recommendations = recommendationService.getRecommendationsForStudent(studentId);

    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
