import React, { useState } from 'react';
import api from '../services/api';
import AlbumCard from './AlbumCard';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#ffb703', desc: 'Upbeat, feel-good pop & dance' },
  { id: 'sad', label: 'Sad', emoji: '💔', color: '#8ecae6', desc: 'Melancholy, acoustic & emotional ballads' },
  { id: 'energetic', label: 'Energetic', emoji: '🔥', color: '#ff4d6d', desc: 'High-tempo workouts & electrifying beats' },
  { id: 'relaxing', label: 'Relaxing', emoji: '😌', color: '#06d6a0', desc: 'Chill lofi, calm acoustics & ambient' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️', color: '#f72585', desc: 'Soulful R&B, intimate melodies & love songs' },
];

export default function MoodFinder({ onSelectDetails, onToggleFavorite, favoritesMap, isLoggedIn, onSelectForCompare }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectMood = async (moodId) => {
    setSelectedMood(moodId);
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/albums/mood/${moodId}`);
      setAlbums(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load mood recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mood-finder-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🎭</span> Find Your Mood
        </h2>
        <p className="section-subtitle">
          Select how you feel right now. Our rule-based recommendation engine suggests albums tailored to your vibe.
        </p>
      </div>

      <div className="mood-buttons-grid">
        {MOODS.map((m) => (
          <button
            key={m.id}
            className={`mood-button ${selectedMood === m.id ? 'active' : ''}`}
            onClick={() => handleSelectMood(m.id)}
            style={{
              borderColor: selectedMood === m.id ? m.color : 'transparent',
              boxShadow: selectedMood === m.id ? `0 0 16px ${m.color}40` : 'none',
            }}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
            <span className="mood-desc">{m.desc}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding recommendations...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {!loading && selectedMood && albums.length > 0 && (
        <div className="mood-results">
          <div className="results-header">
            <h3>Recommended Albums for <span>{MOODS.find(m => m.id === selectedMood)?.emoji} {selectedMood.toUpperCase()}</span></h3>
            <span className="results-count">{albums.length} albums found</span>
          </div>

          <div className="albums-grid">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onSelectDetails={onSelectDetails}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoritesMap ? !!favoritesMap[album.id] : false}
                isLoggedIn={isLoggedIn}
                onSelectForCompare={onSelectForCompare}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
