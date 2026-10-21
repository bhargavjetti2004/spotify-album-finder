import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🎵</span>
          <span className="brand-text">Spotify Finder</span>
        </Link>

        <button 
          className="mobile-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/mood" className={isActive('/mood')} onClick={() => setMenuOpen(false)}>
              Mood Finder
            </Link>
            <Link to="/compare" className={isActive('/compare')} onClick={() => setMenuOpen(false)}>
              Compare
            </Link>
            {user && (
              <>
                <Link to="/favorites" className={isActive('/favorites')} onClick={() => setMenuOpen(false)}>
                  Favorites
                </Link>
                <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>
                  History
                </Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="user-greeting">
                <span className="welcome-text">Welcome, <strong>{user.name}</strong></span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
