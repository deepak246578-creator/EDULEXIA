/**
 * DATABASE CONNECTION MANAGER
 * 
 * Attempts to connect to MongoDB using MONGODB_URI.
 * If MongoDB is not running, gracefully enables the local persistent storage engine.
 */

const mongoose = require('mongoose');
const storage = require('../data/storageAdapter');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dyslexia_learning_support';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    storage.isMongoConnected = true;
    return true;
  } catch (err) {
    console.warn(`[Database] Notice: MongoDB connection failed (${err.message}).`);
    console.log('[Database] Auto-switching to Resilient Embedded Storage Mode.');
    console.log('[Database] Local persistent database active at: server/data/localStore.json');
    storage.isMongoConnected = false;
    return false;
  }
};

module.exports = connectDB;
