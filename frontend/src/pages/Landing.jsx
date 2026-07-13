import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, ArrowRight, Bot, Trophy, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Landing = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        if (!name) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await onRegister(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', width: '100vw' }}>
      
      {/* Onboarding / Visual Left Panel */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          borderRight: '1px solid var(--card-border)'
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Main Title Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <GraduationCap size={28} color="white" />
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Edu<span className="text-gradient">AI</span>
            </span>
          </div>

          <h1 style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '16px', fontWeight: 800 }} className="float-animation">
            Accelerate Your Learning with <span className="text-gradient">AI Guidance</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
            Unleash your potential with customized courses, active recall quizzes, a 24/7 AI tutor, and interactive streak rewards.
          </p>

          {/* Features Grid list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px', borderRadius: '10px', color: '#6366f1' }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>AI Study Tutor</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Instant interactive answers, sandboxed code templates, and conceptual details.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '10px', color: '#8b5cf6' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Personalized Courses</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High-quality lessons covering full-stack web architectures, core programming, and AI basics.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px', color: '#10b981' }}>
                <Trophy size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Active Quizzes</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reinforce your knowledge and track metrics on streak scores, answers, and summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <GlassCard style={{ width: '100%', maxWidth: '440px', padding: '40px' }} className="slide-up">
          {/* Header */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Log in to continue your path.' : 'Register to start learning today.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {error && (
              <div 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#ef4444', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                {error}
              </div>
            )}

            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="form-input" 
                    style={{ paddingLeft: '44px' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="email" 
                  placeholder="student@university.com" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="gradient-btn" style={{ justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Form Switcher Footer */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--accent-color)', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default Landing;
