import React from 'react';

export default function AlbumCard({
  album,
  onSelectDetails,
  onToggleFavorite,
  isFavorite = false,
  onSelectForCompare,
  isSelectedForCompare = false,
  isLoggedIn = false
}) {
  const releaseYear = album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A';
  const defaultImage = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60";

  return (
    <div className={`album-card ${isSelectedForCompare ? 'selected-compare' : ''}`}>
      <div className="album-card-image-wrap" onClick={() => onSelectDetails && onSelectDetails(album)}>
        <img
          src={album.imageUrl || defaultImage}
          alt={album.name}
          className="album-card-image"
          loading="lazy"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="album-card-overlay">
          <span className="overlay-btn">View Details ↗</span>
        </div>
        {album.popularity > 0 && (
          <div className="popularity-badge" title={`Popularity: ${album.popularity}/100`}>
            ⭐ {album.popularity}
          </div>
        )}
      </div>

      <div className="album-card-info">
        <h3 className="album-title" title={album.name} onClick={() => onSelectDetails && onSelectDetails(album)}>
          {album.name}
        </h3>
        <p className="album-artist" title={album.artist}>{album.artist}</p>

        <div className="album-meta">
          <span className="meta-item">📅 {releaseYear}</span>
          <span className="meta-separator">•</span>
          <span className="meta-item">🎵 {album.totalTracks} tracks</span>
        </div>

        <div className="album-card-actions">
          {isLoggedIn ? (
            <button
              className={`btn btn-sm ${isFavorite ? 'btn-fav-active' : 'btn-fav'}`}
              onClick={() => onToggleFavorite && onToggleFavorite(album)}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? '❤️ Favorited' : '🤍 Favorite'}
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-subtle"
              onClick={() => onToggleFavorite && onToggleFavorite(album)}
              title="Log in to save favorites"
            >
              🤍 Favorite
            </button>
          )}

          {onSelectForCompare && (
            <button
              className={`btn btn-sm ${isSelectedForCompare ? 'btn-compare-active' : 'btn-outline'}`}
              onClick={() => onSelectForCompare(album)}
            >
              {isSelectedForCompare ? '✓ Selected' : '🆚 Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
