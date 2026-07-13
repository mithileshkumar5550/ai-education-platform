const mongoose = require('mongoose');
const { getIsMongoDB, getLocalData, saveLocalData } = require('../config/db');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: String, required: true }, // refers to Course ID
  questions: [QuestionSchema]
}, { timestamps: true });

const MongoQuiz = mongoose.model('Quiz', QuizSchema);

const QuizRepo = {
  find: async () => {
    if (getIsMongoDB()) {
      return await MongoQuiz.find({});
    }
    const data = getLocalData();
    return data.quizzes;
  },

  findById: async (id) => {
    if (getIsMongoDB()) {
      return await MongoQuiz.findById(id);
    }
    const data = getLocalData();
    return data.quizzes.find(q => q._id === id) || null;
  },

  findByCourseId: async (courseId) => {
    if (getIsMongoDB()) {
      return await MongoQuiz.findOne({ courseId });
    }
    const data = getLocalData();
    return data.quizzes.find(q => q.courseId === courseId) || null;
  },

  // Helper for seeding data
  createMany: async (quizzesArray) => {
    if (getIsMongoDB()) {
      await MongoQuiz.deleteMany({});
      return await MongoQuiz.insertMany(quizzesArray);
    }
    const data = getLocalData();
    data.quizzes = quizzesArray.map((q, i) => ({
      _id: q._id || (Date.now() + i + 100).toString(),
      ...q,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    saveLocalData(data);
    return data.quizzes;
  }
};

module.exports = QuizRepo;
