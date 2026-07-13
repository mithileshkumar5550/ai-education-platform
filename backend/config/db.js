const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

let isMongoDB = false;

const localDbPath = path.join(__dirname, '../data/local_db.json');

// Ensure data directory exists
const dataDir = path.dirname(localDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure local DB file exists with basic structure
if (!fs.existsSync(localDbPath)) {
  fs.writeFileSync(localDbPath, JSON.stringify({ users: [], courses: [], quizzes: [] }, null, 2));
}

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️ MONGODB_URI not found in environment. Running with local JSON database.');
    isMongoDB = false;
    return;
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully.');
    isMongoDB = true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️ Falling back to local JSON database.');
    isMongoDB = false;
  }
};

const getLocalData = () => {
  try {
    const data = fs.readFileSync(localDbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], courses: [], quizzes: [] };
  }
};

const saveLocalData = (data) => {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write local database file', err);
  }
};

module.exports = {
  connectDB,
  getIsMongoDB: () => isMongoDB,
  getLocalData,
  saveLocalData
};
