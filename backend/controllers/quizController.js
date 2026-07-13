const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.getQuizByCourseId = async (req, res) => {
  try {
    const quiz = await Quiz.findByCourseId(req.params.courseId);
    if (!quiz) {
      return res.status(404).json({ message: 'No quiz found for this course' });
    }
    // We can return the questions (but hide the correct answer indexes if we want strict server-side grading, or include them for local client-side interactivity).
    // Let's include the correct indexes since it is an educational platform with explanations, and we want to allow immediate evaluation on the client side!
    res.json(quiz);
  } catch (error) {
    console.error('Fetch quiz error:', error);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
};

exports.submitQuizScore = async (req, res) => {
  const { quizId, score, totalQuestions } = req.body;

  try {
    if (score === undefined || !totalQuestions) {
      return res.status(400).json({ message: 'score and totalQuestions are required' });
    }

    const quizScore = {
      quizId,
      score,
      totalQuestions,
      timestamp: new Date()
    };

    const updatedUser = await User.updateProgress(req.user.id, null, quizScore);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Quiz score submitted successfully',
      progress: updatedUser.progress
    });
  } catch (error) {
    console.error('Submit quiz score error:', error);
    res.status(500).json({ message: 'Server error submitting quiz score' });
  }
};
