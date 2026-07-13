const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/course/:courseId', quizController.getQuizByCourseId);
router.post('/submit', authMiddleware, quizController.submitQuizScore);

module.exports = router;
