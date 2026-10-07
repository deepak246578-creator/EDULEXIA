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

// Root Route: Friendly Landing & API Gateway
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>EDULEXIA • Backend Server</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #070a08;
            color: #f0fdf4;
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .card {
            background: #0d1611;
            border: 2px solid #10b981;
            border-radius: 24px;
            padding: 40px;
            max-width: 540px;
            box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
          }
          h1 {
            color: #10b981;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 800;
          }
          p {
            color: #86efac;
            font-size: 14px;
            line-height: 1.6;
            margin: 12px 0 24px 0;
          }
          .btn {
            display: inline-block;
            background: #10b981;
            color: #000;
            font-weight: 800;
            padding: 14px 28px;
            border-radius: 14px;
            text-decoration: none;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }
          .btn:hover {
            background: #34d399;
            transform: scale(1.04);
          }
          .links {
            margin-top: 24px;
            font-size: 12px;
          }
          .links a {
            color: #34d399;
            margin: 0 8px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>EDULEXIA Backend Server</h1>
          <p>
            The backend API server is <strong>running successfully on port 5000</strong>.<br/>
            To use the web application with 7-Stage Screening & Phonics Practice, open the frontend:
          </p>
          <a class="btn" href="http://localhost:3000/">Open EDULEXIA Web App (Port 3000) &rarr;</a>
          <div class="links">
            <a href="/api/health">Check API Health &rarr;</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.json({
      status: 'online',
      message: 'EDULEXIA API Server is active.',
      frontend: 'http://localhost:3000',
      health: '/api/health'
    });
  }
});

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
