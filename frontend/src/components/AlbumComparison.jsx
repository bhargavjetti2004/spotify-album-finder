import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SAMPLE_ALBUMS = [
  { id: '4aawyAB9vmqN3uQ7FjRGTy', name: "1989 (Taylor's Version) — Taylor Swift" },
  { id: '4yP0hdKOJeuukvuPAOzIRR', name: "After Hours — The Weeknd" },
  { id: '6PwvroL76qP920B2F2w1qB', name: "÷ (Divide) — Ed Sheeran" },
  { id: '0bcaA97ZnjIpaoPO8WjMRB', name: "Future Nostalgia — Dua Lipa" },
  { id: '1I54vYc03uN3dD9NkJQ75Z', name: "Rockstar — A.R. Rahman" },
  { id: '4K72wYb12mP8kL7HjQ33Wz', name: "Aashiqui 2 — Arijit Singh" },
  { id: '6O33aQf66sR7aM2HjQ99Xy', name: "Jawan — Anirudh Ravichander" },
  { id: '1ATL5GLyef8ucheqEgYcuP', name: "Scorpion — Drake" },
  { id: '5r36AJflADdoQmHpVdcC9V', name: "Harry's House — Harry Styles" },
  { id: '6mUdeDZCsExyJLMpAfDuwh', name: "Map of the Soul: 7 — BTS" },
  { id: '0ptnKffgG9k5lKk9sJmR9Q', name: "21 — Adele" },
  { id: '5s0ALVDZ3p9KeqrE09H6K7', name: "24K Magic — Bruno Mars" },
  { id: '4eLPsYPBmXABThSJ821sqY', name: "DAMN. — Kendrick Lamar" },
  { id: '4vT35g2zFkG1KsmJ2vR5rC', name: "A Head Full of Dreams — Coldplay" },
];

export default function AlbumComparison({ initialAlbum1 = null, initialAlbum2 = null }) {
  const [id1, setId1] = useState(initialAlbum1?.id || '4aawyAB9vmqN3uQ7FjRGTy');
  const [id2, setId2] = useState(initialAlbum2?.id || '4yP0hdKOJeuukvuPAOzIRR');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialAlbum1) setId1(initialAlbum1.id);
    if (initialAlbum2) setId2(initialAlbum2.id);
  }, [initialAlbum1, initialAlbum2]);

  const handleCompare = async () => {
    if (!id1 || !id2) {
      setError('Please select two albums to compare.');
      return;
    }
    if (id1 === id2) {
      setError('Please select two different albums to compare.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/albums/compare?id1=${encodeURIComponent(id1)}&id2=${encodeURIComponent(id2)}`);
      setComparison(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compare albums. Please check the IDs and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCompare();
  }, []);

  return (
    <section className="comparison-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🆚</span> Album Comparison
        </h2>
        <p className="section-subtitle">
          Pit two albums head-to-head. Compare popularity, track completeness, and release era with our deterministic Project Comparison Score.
        </p>
      </div>

      <div className="comparison-controls-card">
        <div className="comparison-inputs-grid">
          <div className="comparison-select-group">
            <label className="input-label">Album 1</label>
            <select
              className="form-select"
              value={id1}
              onChange={(e) => setId1(e.target.value)}
            >
              {SAMPLE_ALBUMS.map((a) => (
                <option key={`a1-${a.id}`} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="comparison-vs-badge">VS</div>

          <div className="comparison-select-group">
            <label className="input-label">Album 2</label>
            <select
              className="form-select"
              value={id2}
              onChange={(e) => setId2(e.target.value)}
            >
              {SAMPLE_ALBUMS.map((a) => (
                <option key={`a2-${a.id}`} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="comparison-btn-wrapper">
          <button
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? 'Calculating Scores...' : 'Compare Albums'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing and calculating scores...</p>
        </div>
      )}

      {!loading && comparison && (
        <div className="comparison-results-wrapper">
          <div className="winner-banner">
            <div className="winner-trophy">🏆</div>
            <div className="winner-info">
              <span className="winner-label">Outcome</span>
              <h3 className="winner-title">{comparison.winner === 'Tie' ? "It's a Tie!" : `Winner: ${comparison.winnerAlbumName}`}</h3>
              <p className="winner-score-summary">
                {comparison.album1.name}: <strong>{comparison.album1Score} pts</strong> vs {comparison.album2.name}: <strong>{comparison.album2Score} pts</strong>
              </p>
            </div>
          </div>

          <div className="comparison-cards-grid">
            {/* Album 1 Card */}
            <div className={`compare-album-card ${comparison.winner === 'Album 1' ? 'winner-card' : ''}`}>
              {comparison.winner === 'Album 1' && <span className="winner-tag">🏆 WINNER</span>}
              <img
                src={comparison.album1.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400"}
                alt={comparison.album1.name}
                className="compare-art"
              />
              <h4 className="compare-title">{comparison.album1.name}</h4>
              <p className="compare-artist">{comparison.album1.artist}</p>

              <div className="score-display">
                <span className="score-number">{comparison.album1Score}</span>
                <span className="score-max">/ 100</span>
                <span className="score-label">Project Comparison Score</span>
              </div>

              <div className="compare-stats-table">
                <div className="stat-row">
                  <span>Popularity:</span>
                  <strong>{comparison.album1.popularity} / 100</strong>
                </div>
                <div className="stat-row">
                  <span>Track Count:</span>
                  <strong>{comparison.album1.totalTracks} tracks</strong>
                </div>
                <div className="stat-row">
                  <span>Release Year:</span>
                  <strong>{comparison.album1.releaseDate?.substring(0, 4) || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Album 2 Card */}
            <div className={`compare-album-card ${comparison.winner === 'Album 2' ? 'winner-card' : ''}`}>
              {comparison.winner === 'Album 2' && <span className="winner-tag">🏆 WINNER</span>}
              <img
                src={comparison.album2.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400"}
                alt={comparison.album2.name}
                className="compare-art"
              />
              <h4 className="compare-title">{comparison.album2.name}</h4>
              <p className="compare-artist">{comparison.album2.artist}</p>

              <div className="score-display">
                <span className="score-number">{comparison.album2Score}</span>
                <span className="score-max">/ 100</span>
                <span className="score-label">Project Comparison Score</span>
              </div>

              <div className="compare-stats-table">
                <div className="stat-row">
                  <span>Popularity:</span>
                  <strong>{comparison.album2.popularity} / 100</strong>
                </div>
                <div className="stat-row">
                  <span>Track Count:</span>
                  <strong>{comparison.album2.totalTracks} tracks</strong>
                </div>
                <div className="stat-row">
                  <span>Release Year:</span>
                  <strong>{comparison.album2.releaseDate?.substring(0, 4) || 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="algorithm-disclaimer-card">
            <h4>ℹ️ About the Project Comparison Score</h4>
            <p>{comparison.explanation}</p>
            <p className="disclaimer-note">
              <em>Note: This score is an independent, deterministic project ranking algorithm based on Spotify metadata and is not an official Spotify editorial ranking.</em>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
