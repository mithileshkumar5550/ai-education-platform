const mongoose = require('mongoose');
const { getIsMongoDB, getLocalData, saveLocalData } = require('../config/db');

// MongoDB Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress: {
    completedLessons: [{ type: String }], // array of lessonIds
    quizScores: [{
      quizId: String,
      score: Number,
      totalQuestions: Number,
      timestamp: { type: Date, default: Date.now }
    }],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  }
}, { timestamps: true });

const MongoUser = mongoose.model('User', UserSchema);

// Fallback JSON-based operations
const UserRepo = {
  findOne: async (query) => {
    if (getIsMongoDB()) {
      return await MongoUser.findOne(query);
    }
    const data = getLocalData();
    if (query.email) {
      return data.users.find(u => u.email.toLowerCase() === query.email.toLowerCase()) || null;
    }
    if (query._id) {
      return data.users.find(u => u._id === query._id) || null;
    }
    return null;
  },

  findById: async (id) => {
    if (getIsMongoDB()) {
      return await MongoUser.findById(id);
    }
    const data = getLocalData();
    return data.users.find(u => u._id === id) || null;
  },

  create: async (userData) => {
    if (getIsMongoDB()) {
      const newUser = new MongoUser(userData);
      return await newUser.save();
    }
    const data = getLocalData();
    const newUser = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      progress: {
        completedLessons: [],
        quizScores: [],
        streak: 0,
        lastActive: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    data.users.push(newUser);
    saveLocalData(data);
    return newUser;
  },

  updateProgress: async (userId, completedLessons, quizScore) => {
    if (getIsMongoDB()) {
      const user = await MongoUser.findById(userId);
      if (!user) return null;

      // Update completed lessons
      if (completedLessons) {
        completedLessons.forEach(lessonId => {
          if (!user.progress.completedLessons.includes(lessonId)) {
            user.progress.completedLessons.push(lessonId);
          }
        });
      }

      // Update quiz scores
      if (quizScore) {
        user.progress.quizScores.push(quizScore);
      }

      // Calculate streak
      const now = new Date();
      const lastActive = user.progress.lastActive ? new Date(user.progress.lastActive) : null;
      if (lastActive) {
        const diffTime = Math.abs(now - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.progress.streak += 1;
        } else if (diffDays > 1) {
          user.progress.streak = 1;
        }
      } else {
        user.progress.streak = 1;
      }
      user.progress.lastActive = now;

      return await user.save();
    }

    // JSON Fallback
    const data = getLocalData();
    const userIndex = data.users.findIndex(u => u._id === userId);
    if (userIndex === -1) return null;

    const user = data.users[userIndex];
    if (completedLessons) {
      completedLessons.forEach(lessonId => {
        if (!user.progress.completedLessons.includes(lessonId)) {
          user.progress.completedLessons.push(lessonId);
        }
      });
    }

    if (quizScore) {
      user.progress.quizScores.push({
        ...quizScore,
        timestamp: new Date()
      });
    }

    // Calculate streak
    const now = new Date();
    const lastActive = user.progress.lastActive ? new Date(user.progress.lastActive) : null;
    if (lastActive) {
      const diffTime = Math.abs(now - lastActive);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.progress.streak += 1;
      } else if (diffDays > 1) {
        user.progress.streak = 1;
      }
    } else {
      user.progress.streak = 1;
    }
    user.progress.lastActive = now;
    user.updatedAt = now;

    data.users[userIndex] = user;
    saveLocalData(data);
    return user;
  }
};

module.exports = UserRepo;
