import React from 'react';

export default function AlbumDetails({ album, onClose, onToggleFavorite, isFavorite, isLoggedIn }) {
  if (!album) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        <div className="details-layout">
          <div className="details-cover-wrap">
            <img
              src={album.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60"}
              alt={album.name}
              className="details-cover-image"
            />
          </div>

          <div className="details-info">
            <span className="details-badge">Album Details</span>
            <h2 className="details-title">{album.name}</h2>
            <h3 className="details-artist">by {album.artist}</h3>

            <div className="details-metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Release Date</span>
                <span className="metric-value">{album.releaseDate || 'N/A'}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Total Tracks</span>
                <span className="metric-value">{album.totalTracks} tracks</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Popularity</span>
                <span className="metric-value">{album.popularity} / 100</span>
              </div>
            </div>

            <div className="popularity-bar-container">
              <div className="popularity-bar-label">
                <span>Spotify Popularity Meter</span>
                <span>{album.popularity}%</span>
              </div>
              <div className="popularity-bar-track">
                <div
                  className="popularity-bar-fill"
                  style={{ width: `${Math.min(100, Math.max(0, album.popularity))}%` }}
                ></div>
              </div>
            </div>

            <div className="details-action-buttons">
              {album.spotifyUrl && (
                <a
                  href={album.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-spotify"
                >
                  <span className="spotify-icon">🟢</span> Open in Spotify ↗
                </a>
              )}

              {isLoggedIn ? (
                <button
                  className={`btn ${isFavorite ? 'btn-fav-active' : 'btn-outline'}`}
                  onClick={() => onToggleFavorite && onToggleFavorite(album)}
                >
                  {isFavorite ? '❤️ In Favorites' : '🤍 Add to Favorites'}
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => onToggleFavorite && onToggleFavorite(album)}
                >
                  🤍 Log In to Favorite
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
