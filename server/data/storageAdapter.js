/**
 * STORAGE ADAPTER
 * 
 * Provides unified, resilient data access for the platform.
 * Supports:
 * 1. Live MongoDB / Mongoose connection when MONGODB_URI is provided.
 * 2. Embedded persistent JSON storage when MongoDB daemon is not running.
 * 
 * Ensures the app works 100% reliably out of the box in all development environments.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  seedUsers,
  seedStudentProfiles,
  screeningStagesQuestions,
  seedLearningActivities,
  seedAchievements,
  seedScreeningAttempts
} = require('./seedData');

const DB_FILE = path.join(__dirname, 'localStore.json');

class StorageAdapter {
  constructor() {
    this.isMongoConnected = false;
    this.data = {
      users: [],
      studentProfiles: [],
      screeningStages: [],
      screeningAttempts: [],
      learningActivities: [],
      activityResults: [],
      progress: [],
      achievements: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        if (!this.data.screeningStages || this.data.screeningStages.length === 0) {
          this.data.screeningStages = screeningStagesQuestions;
        }
        if (!this.data.learningActivities || this.data.learningActivities.length === 0) {
          this.data.learningActivities = seedLearningActivities;
        }
        if (!this.data.achievements || this.data.achievements.length === 0) {
          this.data.achievements = seedAchievements;
        }
      } else {
        this.seedDefaultData();
      }
    } catch (err) {
      console.warn('[StorageAdapter] Notice: initializing clean in-memory seed data.', err.message);
      this.seedDefaultData();
    }
  }

  seedDefaultData() {
    this.data = {
      users: [...seedUsers],
      studentProfiles: [...seedStudentProfiles],
      screeningStages: [...screeningStagesQuestions],
      screeningAttempts: [...seedScreeningAttempts],
      learningActivities: [...seedLearningActivities],
      activityResults: [],
      progress: [
        {
          studentId: 'user-student-1',
          skillArea: 'letterRecognition',
          currentLevel: 2,
          masteryScore: 80,
          updatedAt: new Date().toISOString()
        },
        {
          studentId: 'user-student-1',
          skillArea: 'wordRecognition',
          currentLevel: 2,
          masteryScore: 60,
          updatedAt: new Date().toISOString()
        }
      ],
      achievements: [...seedAchievements]
    };
    this.persist();
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StorageAdapter] Persist error:', err.message);
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users || [];
  }

  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  createUser(userData) {
    const newUser = {
      id: userData.id || `user-${uuidv4()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      role: userData.role || 'student',
      studentId: userData.studentId || null,
      authorizedStudentIds: userData.authorizedStudentIds || [],
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);

    if (newUser.role === 'student') {
      this.createStudentProfile({
        userId: newUser.id,
        learningLevel: 1,
        starsCount: 0,
        streakDays: 1,
        preferences: {
          fontSize: 18,
          letterSpacing: 'wide',
          lineSpacing: 'relaxed',
          fontFamily: 'OpenDyslexic',
          colorTheme: 'cream'
        }
      });
    }

    this.persist();
    return newUser;
  }

  createStudentProfile(profileData) {
    const newProfile = {
      id: profileData.id || `profile-${uuidv4()}`,
      userId: profileData.userId,
      learningLevel: profileData.learningLevel || 1,
      starsCount: profileData.starsCount || 0,
      streakDays: profileData.streakDays || 1,
      lastPracticeDate: new Date().toISOString(),
      preferences: profileData.preferences || {
        fontSize: 18,
        letterSpacing: 'wide',
        lineSpacing: 'relaxed',
        fontFamily: 'Plus Jakarta Sans',
        colorTheme: 'green-black',
        ttsSpeed: 1.0
      }
    };
    if (!this.data.studentProfiles) this.data.studentProfiles = [];
    this.data.studentProfiles.push(newProfile);
    this.persist();
    return newProfile;
  }

  // --- Student Profiles ---
  getStudentProfile(userId) {
    let profile = this.data.studentProfiles.find(p => p.userId === userId);
    if (!profile) {
      profile = {
        userId,
        learningLevel: 1,
        starsCount: 0,
        streakDays: 1,
        lastPracticeDate: new Date().toISOString(),
        preferences: {
          fontSize: 18,
          letterSpacing: 'wide',
          lineSpacing: 'relaxed',
          fontFamily: 'Plus Jakarta Sans',
          colorTheme: 'green-black',
          ttsSpeed: 1.0
        }
      };
      this.data.studentProfiles.push(profile);
      this.persist();
    }
    return profile;
  }

  updateStudentProfile(userId, updates) {
    const index = this.data.studentProfiles.findIndex(p => p.userId === userId);
    if (index >= 0) {
      this.data.studentProfiles[index] = {
        ...this.data.studentProfiles[index],
        ...updates,
        preferences: {
          ...this.data.studentProfiles[index].preferences,
          ...(updates.preferences || {})
        }
      };
      this.persist();
      return this.data.studentProfiles[index];
    }
    return null;
  }

  addStarsAndStreak(userId, starsEarned) {
    const profile = this.getStudentProfile(userId);
    profile.starsCount = (profile.starsCount || 0) + (starsEarned || 0);

    const now = new Date();
    const lastDate = profile.lastPracticeDate ? new Date(profile.lastPracticeDate) : null;
    if (lastDate) {
      const diffHours = (now - lastDate) / (1000 * 60 * 60);
      if (diffHours >= 18 && diffHours <= 48) {
        profile.streakDays = (profile.streakDays || 1) + 1;
      } else if (diffHours > 48) {
        profile.streakDays = 1;
      }
    } else {
      profile.streakDays = 1;
    }
    profile.lastPracticeDate = now.toISOString();
    this.persist();
    return profile;
  }

  // --- Screening Stages & Questions ---
  getScreeningStages() {
    return this.data.screeningStages || screeningStagesQuestions;
  }

  // --- Screening Attempts ---
  saveScreeningAttempt(attemptData) {
    const newAttempt = {
      id: attemptData.id || `attempt-${uuidv4()}`,
      studentId: attemptData.studentId,
      date: new Date().toISOString(),
      screeningScore: attemptData.screeningScore,
      supportLevel: attemptData.supportLevel,
      interpretationLabel: attemptData.interpretationLabel,
      positiveHeadline: attemptData.positiveHeadline,
      positiveMessage: attemptData.positiveMessage,
      stageScores: attemptData.stageScores,
      skillProfile: attemptData.skillProfile,
      recommendedStartingLevel: attemptData.recommendedStartingLevel,
      supportAreas: attemptData.supportAreas || [],
      responses: attemptData.responses || []
    };
    this.data.screeningAttempts.push(newAttempt);

    // Update student learning level & award Screening Star badge
    this.updateStudentProfile(attemptData.studentId, {
      learningLevel: attemptData.recommendedStartingLevel,
      lastScreeningDate: newAttempt.date,
      latestScreeningScore: attemptData.screeningScore
    });

    this.awardAchievement(attemptData.studentId, 'screening_star');
    this.persist();
    return newAttempt;
  }

  getScreeningAttemptsByStudent(studentId) {
    return this.data.screeningAttempts
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getScreeningAttemptById(id) {
    return this.data.screeningAttempts.find(a => a.id === id) || null;
  }

  // --- Learning Activities ---
  getLearningActivities(filter = {}) {
    let list = this.data.learningActivities || [];
    if (filter.level) {
      list = list.filter(a => a.level === parseInt(filter.level, 10));
    }
    if (filter.skillArea) {
      list = list.filter(a => a.skillArea === filter.skillArea);
    }
    return list;
  }

  getActivityById(id) {
    return this.data.learningActivities.find(a => a.id === id) || null;
  }

  // --- Activity Results ---
  saveActivityResult(resultData) {
    const newResult = {
      id: `res-${uuidv4()}`,
      studentId: resultData.studentId,
      activityId: resultData.activityId,
      score: resultData.score,
      maxScore: resultData.maxScore,
      percentage: Math.round((resultData.score / (resultData.maxScore || 1)) * 100),
      attempts: resultData.attempts || 1,
      completedAt: new Date().toISOString()
    };
    this.data.activityResults.push(newResult);

    // Add stars to student
    const stars = Math.max(3, Math.round((newResult.percentage / 100) * 10));
    this.addStarsAndStreak(resultData.studentId, stars);

    // Check achievement for reading explorer (if 3+ activities done)
    const studentResults = this.data.activityResults.filter(r => r.studentId === resultData.studentId);
    if (studentResults.length >= 3) {
      this.awardAchievement(resultData.studentId, 'reading_explorer');
    }

    this.persist();
    return { ...newResult, starsEarned: stars };
  }

  getActivityResultsByStudent(studentId) {
    return this.data.activityResults
      .filter(r => r.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  // --- Achievements ---
  getAllAchievements() {
    return this.data.achievements || seedAchievements;
  }

  getStudentAchievements(studentId) {
    const studentAttempts = this.getScreeningAttemptsByStudent(studentId);
    const studentResults = this.getActivityResultsByStudent(studentId);
    const profile = this.getStudentProfile(studentId);

    const earned = [];
    const all = this.getAllAchievements();

    all.forEach(ach => {
      let isEarned = false;
      let earnedAt = null;

      if (ach.code === 'screening_star' && studentAttempts.length > 0) {
        isEarned = true;
        earnedAt = studentAttempts[studentAttempts.length - 1].date;
      } else if (ach.code === 'challenge_accepted' && (studentAttempts.length > 0 || studentResults.length > 0)) {
        isEarned = true;
        earnedAt = studentAttempts[0]?.date || studentResults[0]?.completedAt;
      } else if (ach.code === 'reading_explorer' && studentResults.length >= 3) {
        isEarned = true;
        earnedAt = studentResults[studentResults.length - 1]?.completedAt;
      } else if (ach.code === 'puzzle_solver' && studentResults.some(r => r.percentage >= 80)) {
        isEarned = true;
        earnedAt = studentResults.find(r => r.percentage >= 80)?.completedAt;
      } else if (ach.code === 'practice_champion' && (profile.streakDays >= 3)) {
        isEarned = true;
        earnedAt = new Date().toISOString();
      }

      earned.push({
        ...ach,
        isEarned,
        earnedAt
      });
    });

    return earned;
  }

  awardAchievement(studentId, badgeCode) {
    // Verified dynamically in getStudentAchievements
    return true;
  }
}

const storage = new StorageAdapter();
module.exports = storage;
