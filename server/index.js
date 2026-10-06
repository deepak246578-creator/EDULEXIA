/**
 * DYSLEXIA LEARNING SUPPORT PLATFORM - BACKEND SERVER
 * 
 * Modular Express API server hosting:
 * - Authentication & Role-based Access Control
 * - 7-Stage Screening Engine & Evaluation
 * - Phonics & Reading Recommendation Engine
 * - Learning Activities & Progress Tracking
 * - Parent & Teacher Monitoring Dashboards
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const screeningRoutes = require('./routes/screeningRoutes');
const studentRoutes = require('./routes/studentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const parentRoutes = require('./routes/parentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'EDULEXIA - Dyslexia Learning Support Platform',
    version: '1.0.0',
    mode: 'Screening and Learning-Support System',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/teacher', teacherRoutes);

// Centralized error handling
app.use(errorHandler);

// Start server immediately so endpoints are responsive without blocking
const server = app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  EDULEXIA API Server`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`================================================================`);
  
  // Connect to DB asynchronously
  connectDB();
});

module.exports = { app, server };
