import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, BookOpen, MessageSquare, User, LogOut, Flame } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-layout">
      <div className="layout-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} color="white" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '-0.03em' }}>
            Edu<span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link 
            to="/dashboard" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none', 
              color: isActive('/dashboard') ? '#fff' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'var(--transition-smooth)',
              borderBottom: isActive('/dashboard') ? '2px solid var(--accent-color)' : '2px solid transparent',
              padding: '6px 0'
            }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link 
            to="/courses" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none', 
              color: isActive('/courses') ? '#fff' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'var(--transition-smooth)',
              borderBottom: isActive('/courses') ? '2px solid var(--accent-color)' : '2px solid transparent',
              padding: '6px 0'
            }}
          >
            <BookOpen size={16} />
            Courses
          </Link>
          <Link 
            to="/chatbot" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none', 
              color: isActive('/chatbot') ? '#fff' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'var(--transition-smooth)',
              borderBottom: isActive('/chatbot') ? '2px solid var(--accent-color)' : '2px solid transparent',
              padding: '6px 0'
            }}
          >
            <MessageSquare size={16} />
            AI Chatbot
          </Link>
          <Link 
            to="/profile" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              textDecoration: 'none', 
              color: isActive('/profile') ? '#fff' : 'var(--text-muted)',
              fontWeight: 500,
              fontSize: '0.95rem',
              transition: 'var(--transition-smooth)',
              borderBottom: isActive('/profile') ? '2px solid var(--accent-color)' : '2px solid transparent',
              padding: '6px 0'
            }}
          >
            <User size={16} />
            Profile
          </Link>
        </div>

        {/* User Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Streak Indicator */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.2)', 
              borderRadius: '20px', 
              padding: '4px 12px',
              color: '#f59e0b',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title="Daily Active Streak"
          >
            <Flame size={14} fill="#f59e0b" />
            <span>{user.progress?.streak || 0} Day Streak</span>
          </div>

          {/* User Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{user.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student</span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
