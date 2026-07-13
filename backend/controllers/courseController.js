const Course = require('../models/Course');
const User = require('../models/User');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Fetch course by ID error:', error);
    res.status(500).json({ message: 'Server error fetching course details' });
  }
};

exports.completeLesson = async (req, res) => {
  const { lessonId } = req.body;

  try {
    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    const updatedUser = await User.updateProgress(req.user.id, [lessonId], null);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Lesson completed successfully',
      progress: updatedUser.progress
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ message: 'Server error updating lesson completion' });
  }
};
