/**
 * MONGOOSE SCHEMAS & MODELS
 * 
 * Provides database models for User, StudentProfile, ScreeningAttempt,
 * LearningActivity, ActivityResult, Progress, and Achievement.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Model
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'parent', 'teacher'], default: 'student' },
  studentId: { type: String, default: null }, // for parent linking
  authorizedStudentIds: [{ type: String }],    // for teacher authorization
  createdAt: { type: Date, default: Date.now }
});

// Student Profile Model
const StudentProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  learningLevel: { type: Number, default: 1, min: 1, max: 6 },
  starsCount: { type: Number, default: 0 },
  streakDays: { type: Number, default: 1 },
  lastPracticeDate: { type: Date, default: Date.now },
  latestScreeningScore: { type: Number, default: null },
  lastScreeningDate: { type: Date, default: null },
  preferences: {
    fontSize: { type: Number, default: 18 },
    letterSpacing: { type: String, default: 'wide' },
    lineSpacing: { type: String, default: 'relaxed' },
    fontFamily: { type: String, default: 'OpenDyslexic' },
    colorTheme: { type: String, default: 'cream' },
    ttsSpeed: { type: Number, default: 0.9 }
  }
});

// Screening Attempt Model
const ScreeningAttemptSchema = new Schema({
  studentId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  screeningScore: { type: Number, required: true, min: 0, max: 100 },
  supportLevel: { type: String, required: true },
  interpretationLabel: { type: String, required: true },
  positiveHeadline: { type: String },
  positiveMessage: { type: String },
  stageScores: { type: Schema.Types.Mixed },
  skillProfile: {
    letterRecognition: { type: String },
    letterSoundMatching: { type: String },
    phonologicalSkills: { type: String },
    wordRecognition: { type: String },
    sentenceReading: { type: String },
    passageReading: { type: String },
    optionalVoiceReading: { type: String }
  },
  recommendedStartingLevel: { type: Number, default: 1 },
  supportAreas: [{ type: String }],
  responses: { type: Schema.Types.Mixed }
});

// Learning Activity Model
const LearningActivitySchema = new Schema({
  activityId: { type: String, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 6 },
  difficulty: { type: String, default: 'beginner' },
  skillArea: { type: String, required: true },
  description: { type: String },
  starsAwarded: { type: Number, default: 5 },
  estimatedMinutes: { type: Number, default: 5 },
  content: { type: Schema.Types.Mixed }
});

// Activity Result Model
const ActivityResultSchema = new Schema({
  studentId: { type: String, required: true },
  activityId: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  attempts: { type: Number, default: 1 },
  completedAt: { type: Date, default: Date.now }
});

// Progress Model
const ProgressSchema = new Schema({
  studentId: { type: String, required: true },
  skillArea: { type: String, required: true },
  currentLevel: { type: Number, default: 1 },
  progressPercentage: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Achievement Model
const AchievementSchema = new Schema({
  studentId: { type: String, required: true },
  badge: { type: String, required: true },
  title: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.models.User || mongoose.model('User', UserSchema),
  StudentProfile: mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema),
  ScreeningAttempt: mongoose.models.ScreeningAttempt || mongoose.model('ScreeningAttempt', ScreeningAttemptSchema),
  LearningActivity: mongoose.models.LearningActivity || mongoose.model('LearningActivity', LearningActivitySchema),
  ActivityResult: mongoose.models.ActivityResult || mongoose.model('ActivityResult', ActivityResultSchema),
  Progress: mongoose.models.Progress || mongoose.model('Progress', ProgressSchema),
  Achievement: mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema)
};
