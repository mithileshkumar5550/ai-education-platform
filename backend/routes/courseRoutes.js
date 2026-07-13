const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.post('/complete-lesson', authMiddleware, courseController.completeLesson);

module.exports = router;
