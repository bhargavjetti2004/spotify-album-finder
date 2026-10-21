import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/history');
      setHistory(response.data);
    } catch (err) {
      setError('Failed to fetch search history.');
    } finally {
      setLoading(false);
    }
  };

  const handleRerunSearch = (query) => {
    navigate('/', { state: { query } });
  };

  return (
    <div className="profile-page-container">
      {/* User Information Card */}
      <div className="profile-user-card">
        <div className="profile-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </div>
        <div className="profile-user-details">
          <h2 className="profile-name">{user?.name || 'User'}</h2>
          <p className="profile-email">📧 {user?.email || 'N/A'}</p>
          <span className="profile-badge">Account Active • JWT Authenticated</span>
        </div>
      </div>

      {/* Search History Section */}
      <div className="history-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🔍</span> Recent Searches
          </h2>
          <p className="section-subtitle">
            Your personal search history recorded safely in MySQL. Click any search to run it again.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your search history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">🔎</div>
            <h3>No Search History Yet</h3>
            <p>When you search for artists and albums while logged in, your recent queries will appear here.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => handleRerunSearch(item.searchQuery)}>
                <div className="history-item-left">
                  <span className="history-icon">🎵</span>
                  <div className="history-query-info">
                    <span className="history-query-text">{item.searchQuery}</span>
                    <span className="history-timestamp">
                      {new Date(item.searchedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline history-action-btn">
                  Search Again ↗
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
