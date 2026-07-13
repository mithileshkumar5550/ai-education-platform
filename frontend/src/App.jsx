import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Quiz from './pages/Quiz';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getProfile();
          setUser(userData);
        } catch (err) {
          console.error('Invalid token, logging out', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const handleRegister = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleUpdateProgress = (newProgress) => {
    if (user) {
      setUser(prev => ({
        ...prev,
        progress: newProgress
      }));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: '#09090b' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 600 }} className="glow-animation">
          Loading EduAI Platform...
        </span>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient background glow blobs */}
        <div className="bg-blob bg-blob-indigo"></div>
        <div className="bg-blob bg-blob-purple"></div>

        {/* Navigation Bar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Page Routes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Landing onLogin={handleLogin} onRegister={handleRegister} />} 
            />
            
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/" replace />} 
            />
            
            <Route 
              path="/courses" 
              element={user ? <Courses user={user} onUpdateProgress={handleUpdateProgress} /> : <Navigate to="/" replace />} 
            />
            
            <Route 
              path="/quiz" 
              element={user ? <Quiz onUpdateProgress={handleUpdateProgress} /> : <Navigate to="/" replace />} 
            />
            
            <Route 
              path="/chatbot" 
              element={user ? <Chatbot /> : <Navigate to="/" replace />} 
            />
            
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/" replace />} 
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
