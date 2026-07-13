import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Flame, ChevronRight, Bot, Sparkles, Clock, Play } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { courseAPI } from '../services/api';

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Compute metrics
  const completedLessonsCount = user.progress?.completedLessons?.length || 0;
  const quizzesTakenCount = user.progress?.quizScores?.length || 0;
  const streak = user.progress?.streak || 0;
  
  // Calculate average quiz score
  const averageScore = quizzesTakenCount > 0
    ? Math.round(
        (user.progress.quizScores.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / quizzesTakenCount) * 100
      )
    : 0;

  return (
    <div className="layout-container fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Welcome Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Welcome back, <span className="text-gradient">{user.name}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is an overview of your active learning journey. Keep up the momentum!</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/chatbot" className="gradient-btn" style={{ gap: '8px' }}>
            <Bot size={18} />
            Ask AI Tutor
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        
        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '14px', borderRadius: '12px', color: '#6366f1' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Lessons Completed</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{completedLessonsCount}</span>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '14px', borderRadius: '12px', color: '#8b5cf6' }}>
            <Award size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Quizzes Passed</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{quizzesTakenCount}</span>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '12px', color: '#10b981' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Average Grade</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{averageScore}%</span>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: '12px', color: '#f59e0b' }}>
            <Flame size={24} fill="#f59e0b" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Streak</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{streak} Day{streak !== 1 && 's'}</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid: Recommended Tracks & AI Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left Side: Course Progress & Recommendations */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Your Learning Tracks</h2>
            <Link to="/courses" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All Courses <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Loading courses...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courses.slice(0, 3).map(course => {
                // Calculate completion percentage
                const courseLessonIds = course.lessons.map(l => l._id);
                const completedInCourse = courseLessonIds.filter(id => 
                  user.progress?.completedLessons?.includes(id)
                ).length;
                const percent = course.lessons.length > 0 
                  ? Math.round((completedInCourse / course.lessons.length) * 100) 
                  : 0;

                return (
                  <GlassCard key={course._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px' }}>
                          {course.category}
                        </span>
                        <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px' }}>
                          {course.difficulty}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{course.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{course.description}</p>
                      
                      {/* Progress Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{percent}% Complete</span>
                      </div>
                    </div>

                    <Link to={`/courses?id=${course._id}`} className="gradient-btn" style={{ padding: '12px', borderRadius: '50%' }}>
                      <Play size={18} fill="white" />
                    </Link>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Quick Action AI & Daily Tip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick AI Help */}
          <GlassCard style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <Bot size={22} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.15rem' }}>Ask your Study Tutor</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Stuck on a homework concept or coding syntax? Type a prompt below to consult the AI.
            </p>
            <Link to="/chatbot" className="gradient-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}>
              Launch Chatbot Room
            </Link>
          </GlassCard>

          {/* Daily Active Tip */}
          <GlassCard>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', color: '#f59e0b' }}>
              <Clock size={20} />
              <h3 style={{ fontSize: '1.15rem', color: '#f59e0b' }}>Daily Learning Hack</h3>
            </div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>The Feynman Technique</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              The best way to understand a complex concept is to write a simplified summary of it as if you were explaining it to a 10-year-old. Write a quick summary to our chatbot!
            </p>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
