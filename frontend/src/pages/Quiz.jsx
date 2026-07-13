import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, ArrowRight, ChevronLeft, HelpCircle, RefreshCw, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { quizAPI, courseAPI } from '../services/api';

const Quiz = ({ onUpdateProgress }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('course');

  const [courses, setCourses] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz game state
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // index of selected option
  const [answersLocked, setAnswersLocked] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  // Fetch list of courses for fallback
  useEffect(() => {
    const fetchCoursesAndQuiz = async () => {
      try {
        setLoading(true);
        setError('');
        const coursesList = await courseAPI.getCourses();
        setCourses(coursesList);

        if (courseId) {
          const quizData = await quizAPI.getQuizByCourseId(courseId);
          setQuiz(quizData);
        }
      } catch (err) {
        console.error('Error fetching quiz info', err);
        setError(err.response?.data?.message || 'Failed to load quiz. Please make sure the course has a quiz.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoursesAndQuiz();
  }, [courseId]);

  const handleStartQuiz = () => {
    setStarted(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswersLocked(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (index) => {
    if (answersLocked) return;
    setSelectedOption(index);
    setAnswersLocked(true);

    const isCorrect = index === quiz.questions[currentIndex].correctOptionIndex;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswersLocked(false);
    } else {
      // Quiz completed! Save score.
      setQuizFinished(true);
      setSavingScore(true);
      try {
        const response = await quizAPI.submitScore(quiz._id, correctAnswersCount, quiz.questions.length);
        onUpdateProgress(response.progress);
      } catch (err) {
        console.error('Error submitting quiz score', err);
      } finally {
        setSavingScore(false);
      }
    }
  };

  const handleRetake = () => {
    handleStartQuiz();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading quiz content...</span>
      </div>
    );
  }

  // Fallback: Course selector if courseId is missing or quiz was not found
  if (!courseId || error || !quiz) {
    return (
      <div className="layout-container fade-in" style={{ padding: '40px 24px', maxWidth: '600px' }}>
        <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
          <Trophy size={48} color="var(--accent-color)" style={{ margin: '0 auto 20px auto', display: 'block' }} className="float-animation" />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Choose a Quiz</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '30px' }}>
            {error ? 'We could not load that quiz. Please select a course below to take its test:' : 'Select a course below to test your knowledge with active recall:'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map(course => (
              <Link 
                key={course._id}
                to={`/quiz?course=${course._id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)'
                }}
                className="glass-panel-hover"
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{course.title} Quiz</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.category}</span>
                </div>
                <ArrowRight size={18} color="var(--accent-color)" />
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // Start Screen
  if (!started) {
    return (
      <div className="layout-container fade-in" style={{ padding: '40px 24px', maxWidth: '600px' }}>
        <Link 
          to={`/courses?id=${courseId}`}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--text-muted)', 
            textDecoration: 'none', 
            fontSize: '0.9rem',
            marginBottom: '20px' 
          }}
        >
          <ChevronLeft size={16} />
          Back to Course Lessons
        </Link>

        <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '16px', borderRadius: '50%', width: 'fit-content', margin: '0 auto 24px auto', boxShadow: '0 8px 30px var(--primary-glow)' }}>
            <Trophy size={40} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{quiz.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
            Ready to test your active recall? This quiz contains **{quiz.questions.length} multiple-choice questions**.
          </p>

          <div 
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'left',
              marginBottom: '32px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6'
            }}
          >
            <strong style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Instructions:</strong>
            - Select the most appropriate answer for each question.<br />
            - Your answer is locked immediately upon selection.<br />
            - Explanations are provided instantly after each choice.<br />
            - Complete all questions to submit your score and update your profile milestones.
          </div>

          <button onClick={handleStartQuiz} className="gradient-btn" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            Start Assessment
          </button>
        </GlassCard>
      </div>
    );
  }

  // Finished Screen
  if (quizFinished) {
    const finalPercentage = Math.round((correctAnswersCount / quiz.questions.length) * 100);
    const hasPassed = finalPercentage >= 70;

    return (
      <div className="layout-container fade-in" style={{ padding: '40px 24px', maxWidth: '600px' }}>
        <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            {hasPassed ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid var(--success)', color: 'var(--success)', padding: '20px', borderRadius: '50%', width: 'fit-content', margin: '0 auto' }}>
                <CheckCircle2 size={48} />
              </div>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid var(--error)', color: 'var(--error)', padding: '20px', borderRadius: '50%', width: 'fit-content', margin: '0 auto' }}>
                <XCircle size={48} />
              </div>
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Assessment Complete!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
            You scored <strong style={{ color: 'white' }}>{correctAnswersCount} out of {quiz.questions.length}</strong> correct responses.
          </p>

          {/* Radial score box */}
          <div 
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '16px', 
              padding: '24px',
              marginBottom: '32px'
            }}
          >
            <span style={{ fontSize: '3rem', fontWeight: 800, color: hasPassed ? 'var(--success)' : 'var(--warning)', display: 'block', lineHeight: '1' }}>
              {finalPercentage}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
              {hasPassed ? '🎉 Excellent job! You passed the topic assessment!' : '💡 Don\'t worry, review the course lessons and try again.'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button onClick={handleRetake} className="secondary-btn" style={{ justifyContent: 'center' }}>
              <RefreshCw size={16} />
              Retake Quiz
            </button>
            <Link to={`/courses?id=${courseId}`} className="gradient-btn" style={{ justifyContent: 'center' }}>
              <BookOpen size={16} />
              Back to Lessons
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Active Game Play Screen
  const currentQuestion = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

  return (
    <div className="layout-container fade-in" style={{ padding: '40px 24px', maxWidth: '640px' }}>
      
      {/* Header with progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Question {currentIndex + 1} of {quiz.questions.length}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Score: {correctAnswersCount}/{currentIndex}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary-gradient)', transition: 'width 0.4s ease' }} />
      </div>

      <GlassCard style={{ padding: '32px' }}>
        {/* Question Text */}
        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', lineHeight: '1.5', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <HelpCircle size={20} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{currentQuestion.questionText}</span>
        </h2>

        {/* Options list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQuestion.correctOptionIndex;
            
            // Visual state colors
            let btnStyle = {
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)'
            };

            if (answersLocked) {
              if (isCorrectAnswer) {
                // Correct option always highlighted in Green when locked
                btnStyle = {
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--success)',
                  color: 'white'
                };
              } else if (isSelected) {
                // User picked wrong options highlighted in Red
                btnStyle = {
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid var(--error)',
                  color: 'white'
                };
              } else {
                // Other unselected options muted
                btnStyle = {
                  background: 'rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.02)',
                  color: 'var(--text-muted)'
                };
              }
            }

            let animClass = "";
            if (answersLocked && isSelected) {
              animClass = isCorrectAnswer ? "success-pop-animation" : "shake-animation";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={answersLocked}
                className={`${!answersLocked ? "glass-panel-hover" : ""} ${animClass}`}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  cursor: answersLocked ? 'default' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-smooth)',
                  ...btnStyle
                }}
              >
                <span>{option}</span>
                {answersLocked && isCorrectAnswer && <CheckCircle2 size={18} color="var(--success)" />}
                {answersLocked && isSelected && !isCorrectAnswer && <XCircle size={18} color="var(--error)" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {answersLocked && (
          <div 
            style={{ 
              background: selectedOption === currentQuestion.correctOptionIndex ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)',
              borderLeft: '4px solid',
              borderColor: selectedOption === currentQuestion.correctOptionIndex ? 'var(--success)' : 'var(--warning)',
              borderRadius: '0 10px 10px 0',
              padding: '16px 20px',
              marginBottom: '24px',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              color: 'var(--text-muted)',
              animation: 'fadeIn 0.4s ease'
            }}
          >
            <strong style={{ display: 'block', color: 'white', marginBottom: '4px' }}>
              {selectedOption === currentQuestion.correctOptionIndex ? '✅ Correct Answer!' : '💡 Explanation:'}
            </strong>
            {currentQuestion.explanation}
          </div>
        )}

        {/* Next Question Control */}
        {answersLocked && (
          <button 
            onClick={handleNext}
            className="gradient-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={savingScore}
          >
            {savingScore ? 'Saving Score...' : currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight size={18} />
          </button>
        )}
      </GlassCard>

    </div>
  );
};

export default Quiz;
