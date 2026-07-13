import React from 'react';
import { User, Award, BookOpen, Flame, Trophy, TrendingUp, Calendar, Mail } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Profile = ({ user }) => {
  const completedLessons = user.progress?.completedLessons || [];
  const quizScores = user.progress?.quizScores || [];
  const streak = user.progress?.streak || 0;

  // Calculate achievements
  const achievements = [
    {
      id: 'first_lesson',
      title: 'First Milestone',
      description: 'Completed your very first lesson on the platform.',
      icon: <BookOpen size={24} />,
      unlocked: completedLessons.length > 0,
      color: '#6366f1'
    },
    {
      id: 'quiz_master',
      title: 'Active Thinker',
      description: 'Passed at least one knowledge check quiz.',
      icon: <Trophy size={24} />,
      unlocked: quizScores.length > 0,
      color: '#8b5cf6'
    },
    {
      id: 'perfect_score',
      title: 'Academic Elite',
      description: 'Scored 100% correct answers on a quiz.',
      icon: <Award size={24} />,
      unlocked: quizScores.some(q => q.score === q.totalQuestions),
      color: '#10b981'
    },
    {
      id: 'streak_warrior',
      title: 'Dedicated Learner',
      description: 'Maintained an active studying streak of 3+ days.',
      icon: <Flame size={24} />,
      unlocked: streak >= 3,
      color: '#f59e0b'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="layout-container fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Profile Overview Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '40px' }}>
        
        {/* User Card */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '24px', borderRadius: '50%', marginBottom: '20px', color: 'white', display: 'flex' }}>
            <User size={64} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{user.name}</h2>
          <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', marginBottom: '24px', border: '1px solid var(--card-border)' }}>
            Level 1 Learner
          </span>

          <div style={{ width: '100%', borderTop: '1px solid var(--card-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <Mail size={16} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', flex: 1 }}>Email:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)', flex: 1 }}>Registered:</span>
              <span style={{ color: 'white', fontWeight: 500 }}>July 2026</span>
            </div>
          </div>
        </GlassCard>

        {/* Milestone achievements grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Skill Achievements</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Unlocked: {unlockedCount} / {achievements.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {achievements.map((ach) => (
              <GlassCard 
                key={ach.id} 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'flex-start',
                  opacity: ach.unlocked ? 1 : 0.45,
                  filter: ach.unlocked ? 'none' : 'grayscale(100%)',
                  background: ach.unlocked ? 'rgba(25, 25, 30, 0.6)' : 'rgba(20, 20, 25, 0.3)',
                  border: ach.unlocked ? `1px solid rgba(255, 255, 255, 0.12)` : '1px solid var(--card-border)'
                }}
              >
                <div 
                  style={{ 
                    background: ach.unlocked ? `rgba(${parseInt(ach.color.slice(1,3), 16) || 120}, ${parseInt(ach.color.slice(3,5), 16) || 120}, ${parseInt(ach.color.slice(5,7), 16) || 200}, 0.1)` : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: ach.unlocked ? ach.color : 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '10px',
                    color: ach.unlocked ? ach.color : 'var(--text-muted)',
                    display: 'flex'
                  }}
                >
                  {ach.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', color: ach.unlocked ? '#fff' : 'var(--text-muted)' }}>
                    {ach.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {ach.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>

      {/* Quiz History Logs Table */}
      <GlassCard style={{ padding: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          <TrendingUp size={22} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.35rem' }}>Assessment Performance History</h2>
        </div>

        {quizScores.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--card-border)', borderRadius: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No quizzes completed yet. Explore a course track to test your knowledge!</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Quiz Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Raw Score</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Percentage</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {quizScores.map((scoreObj, idx) => {
                  const percent = Math.round((scoreObj.score / scoreObj.totalQuestions) * 100);
                  const isPass = percent >= 70;
                  
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '16px', fontWeight: 500, color: 'white' }}>
                        {scoreObj.quizId === 'quiz_web_basics' ? 'Web Development Basics Quiz' : 
                         scoreObj.quizId === 'quiz_react' ? 'Modern React.js Quiz' : 
                         scoreObj.quizId === 'quiz_ml_intro' ? 'Machine Learning Concepts Quiz' : 'General Assessment'}
                      </td>
                      <td style={{ padding: '16px', color: 'white' }}>
                        {scoreObj.score} / {scoreObj.totalQuestions}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ color: isPass ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                          {percent}%
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                        {new Date(scoreObj.timestamp).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default Profile;
