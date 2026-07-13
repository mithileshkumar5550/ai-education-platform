const mongoose = require('mongoose');
const { getIsMongoDB, getLocalData, saveLocalData } = require('../config/db');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: Number, required: true } // in minutes
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  lessons: [LessonSchema]
}, { timestamps: true });

const MongoCourse = mongoose.model('Course', CourseSchema);

const CourseRepo = {
  find: async () => {
    if (getIsMongoDB()) {
      return await MongoCourse.find({});
    }
    const data = getLocalData();
    return data.courses;
  },

  findById: async (id) => {
    if (getIsMongoDB()) {
      return await MongoCourse.findById(id);
    }
    const data = getLocalData();
    return data.courses.find(c => c._id === id) || null;
  },

  // Helper for seeding data
  createMany: async (coursesArray) => {
    if (getIsMongoDB()) {
      // Clear existing first
      await MongoCourse.deleteMany({});
      return await MongoCourse.insertMany(coursesArray);
    }
    const data = getLocalData();
    data.courses = coursesArray.map((c, i) => ({
      _id: c._id || (Date.now() + i).toString(),
      ...c,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    saveLocalData(data);
    return data.courses;
  }
};

module.exports = CourseRepo;
