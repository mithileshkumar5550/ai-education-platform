import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Play, ChevronLeft, ArrowRight, ArrowLeft, Trophy, BookOpenCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { courseAPI } from '../services/api';

// Helper function to render simple markdown content into clean styled HTML
const renderMarkdown = (text) => {
  if (!text) return '';
  
  let html = text;

  // Escape HTML entities to prevent XSS but keep basic tags we generate
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Match headers (###)
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.3rem; margin: 24px 0 12px 0; color:#fff;">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size:1.1rem; margin: 18px 0 8px 0; color:#8b5cf6;">$1</h4>');

  // Match Code Blocks
  html = html.replace(/```(javascript|html|css|jsx|python)?\n([\s\S]*?)\n```/gim, (match, lang, code) => {
    return `<pre style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:10px; overflow-x:auto; margin: 16px 0; font-family:'Courier New', monospace; font-size:0.9rem; color:#e4e4e7;"><code style="white-space:pre-wrap;">${code.trim()}</code></pre>`;
  });

  // Match Inline Code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; font-family:monospace; color:#f43f5e;">$1</code>');

  // Match Lists
  html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 8px; color:var(--text-muted);">$1</li>');

  // Match bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#fff;">$1</strong>');

  // Match Math blocks
  // Block Math: \[\sum ...\]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, '<div style="background:rgba(139,92,246,0.05); padding:16px; border-radius:10px; margin:16px 0; text-align:center; font-family:serif; font-size:1.1rem; color:#c084fc;">$1</div>');
  // Inline Math: \(E=mc^2\)
  html = html.replace(/\\\((.*?)\\\)/g, '<span style="font-family:serif; font-style:italic; color:#c084fc; padding: 0 4px;">$1</span>');

  // Format linebreaks (double breaks to paragraph, single to br)
  html = html.replace(/\n\n/g, '</p><p style="margin-bottom:16px; line-height:1.6; color:var(--text-muted);">');
  
  return `<p style="margin-bottom:16px; line-height:1.6; color:var(--text-muted);">${html}</p>`;
};

const Courses = ({ user, onUpdateProgress }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('id');

  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseAPI.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses list', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const selected = courses.find(c => c._id === courseId);
      if (selected) {
        setActiveCourse(selected);
        setActiveLessonIndex(0);
      }
    } else {
      setActiveCourse(null);
    }
  }, [courseId, courses]);

  const handleCompleteLesson = async () => {
    if (!activeCourse) return;
    const activeLesson = activeCourse.lessons[activeLessonIndex];
    setCompleting(true);

    try {
      const response = await courseAPI.completeLesson(activeLesson._id);
      onUpdateProgress(response.progress);
    } catch (error) {
      console.error('Error completing lesson', error);
    } finally {
      setCompleting(false);
    }
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span style={{ color: 'var(--text-muted)' }}>Loading platform courses...</span>
      </div>
    );
  }

  // Course Grid Page
  if (!activeCourse) {
    return (
      <div className="layout-container fade-in" style={{ padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Course Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Choose an education track below and start your personalized learning module.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {courses.map(course => {
            const courseLessonIds = course.lessons.map(l => l._id);
            const completedInCourse = courseLessonIds.filter(id => 
              user.progress?.completedLessons?.includes(id)
            ).length;
            const completedPercent = course.lessons.length > 0
              ? Math.round((completedInCourse / course.lessons.length) * 100)
              : 0;

            return (
              <GlassCard 
                key={course._id} 
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ flex: 1, marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}>
                      {course.category}
                    </span>
                    <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}>
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{course.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{course.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Progress Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px' }}>
                      <div style={{ width: `${completedPercent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{completedPercent}%</span>
                  </div>

                  <button 
                    onClick={() => setSearchParams({ id: course._id })}
                    className="gradient-btn" 
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Start Track
                    <ArrowRight size={16} />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    );
  }

  // Course Reading / Lesson View Mode
  const activeLesson = activeCourse.lessons[activeLessonIndex];
  const isCurrentLessonCompleted = user.progress?.completedLessons?.includes(activeLesson?._id);
  const totalLessons = activeCourse.lessons.length;
  
  // Calculate completion percentage
  const completedInActive = activeCourse.lessons.map(l => l._id).filter(id => 
    user.progress?.completedLessons?.includes(id)
  ).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      
      {/* Sidebar - Lesson List */}
      <div 
        style={{ 
          background: 'rgba(20, 20, 25, 0.4)', 
          backdropFilter: 'blur(10px)', 
          borderRight: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Course Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)' }}>
          <button 
            onClick={handleBackToList}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.85rem',
              marginBottom: '16px',
              padding: 0
            }}
          >
            <ChevronLeft size={16} />
            Back to Directory
          </button>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{activeCourse.title}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {completedInActive} of {totalLessons} lessons finished
          </span>
        </div>

        {/* Lesson Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeCourse.lessons.map((lesson, idx) => {
              const isCompleted = user.progress?.completedLessons?.includes(lesson._id);
              const isActive = idx === activeLessonIndex;

              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLessonIndex(idx)}
                  style={{
                    width: '100%',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'none',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ color: isActive ? 'white' : 'var(--text-muted)' }}>
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: isActive ? '#fff' : 'var(--text-muted)', fontWeight: 600 }}>{lesson.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration} mins</span>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle size={16} color="var(--success)" fill="rgba(16, 185, 129, 0.15)" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Quick Access to Quiz */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)' }}>
          <Link 
            to={`/quiz?course=${activeCourse._id}`}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              background: completedInActive === totalLessons ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
              border: completedInActive === totalLessons ? 'none' : '1px solid var(--card-border)',
              color: completedInActive === totalLessons ? 'white' : 'var(--text-muted)'
            }}
            className="gradient-btn"
          >
            <Trophy size={16} />
            Test Knowledge
          </Link>
        </div>
      </div>

      {/* Main Content Pane - Active Lesson */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Lesson Reader scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px' }}>
                  Lesson {activeLessonIndex + 1} of {totalLessons}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {activeLesson.duration} min read</span>
              </div>
              <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>{activeLesson.title}</h1>
            </div>

            {/* Markdown Content Parser wrapper */}
            <div 
              className="lesson-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson.content) }}
            />
          </div>
        </div>

        {/* Action Panel Footer */}
        <div 
          style={{ 
            background: 'rgba(20, 20, 25, 0.6)', 
            backdropFilter: 'blur(10px)', 
            borderTop: '1px solid var(--card-border)', 
            padding: '20px 40px' 
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Complete button */}
            <button
              onClick={handleCompleteLesson}
              disabled={isCurrentLessonCompleted || completing}
              className="gradient-btn"
              style={{ 
                background: isCurrentLessonCompleted ? 'rgba(16, 185, 129, 0.15)' : 'var(--primary-gradient)',
                border: isCurrentLessonCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                color: isCurrentLessonCompleted ? 'var(--success)' : 'white',
                cursor: isCurrentLessonCompleted ? 'default' : 'pointer'
              }}
            >
              {isCurrentLessonCompleted ? (
                <>
                  <CheckCircle size={18} />
                  Lesson Completed
                </>
              ) : completing ? (
                'Saving...'
              ) : (
                <>
                  <BookOpenCheck size={18} />
                  Mark as Complete
                </>
              )}
            </button>

            {/* Nav Arrows */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
                disabled={activeLessonIndex === 0}
                className="secondary-btn"
                style={{ padding: '8px 16px', opacity: activeLessonIndex === 0 ? 0.4 : 1, cursor: activeLessonIndex === 0 ? 'default' : 'pointer' }}
              >
                <ArrowLeft size={16} />
                Prev
              </button>
              
              {activeLessonIndex < totalLessons - 1 ? (
                <button
                  onClick={() => setActiveLessonIndex(prev => Math.min(totalLessons - 1, prev + 1))}
                  className="secondary-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <Link
                  to={`/quiz?course=${activeCourse._id}`}
                  className="gradient-btn"
                  style={{ padding: '8px 16px', boxShadow: 'none' }}
                >
                  Go to Quiz
                  <Trophy size={16} />
                </Link>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Courses;
