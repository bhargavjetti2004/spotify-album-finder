import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlbumDetails from '../components/AlbumDetails';

export default function Favorites({ favorites = [], onRemoveFavorite, user }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  return (
    <div className="favorites-page-container">
      <div className="section-header">
        <h1 className="section-title">
          <span className="section-icon">❤️</span> My Favorite Albums
        </h1>
        <p className="section-subtitle">
          Your saved albums collection. Saved safely in your private MySQL account.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">💿</div>
          <h3>No Favorites Saved Yet</h3>
          <p>Explore albums on the home page or via the Mood Finder and click the heart icon to save them here.</p>
          <Link to="/" className="btn btn-primary">
            Explore Music
          </Link>
        </div>
      ) : (
        <div className="albums-grid">
          {favorites.map((fav) => {
            const albumObj = {
              id: fav.spotifyAlbumId,
              name: fav.albumName,
              artist: fav.artistName,
              imageUrl: fav.albumImage,
              releaseDate: 'Saved',
              totalTracks: 0,
              popularity: 0,
              spotifyUrl: `https://open.spotify.com/album/${fav.spotifyAlbumId}`,
            };

            return (
              <div key={fav.id} className="album-card">
                <div className="album-card-image-wrap" onClick={() => setSelectedAlbum(albumObj)}>
                  <img
                    src={fav.albumImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400"}
                    alt={fav.albumName}
                    className="album-card-image"
                  />
                  <div className="album-card-overlay">
                    <span className="overlay-btn">View Details ↗</span>
                  </div>
                </div>

                <div className="album-card-info">
                  <h3 className="album-title" title={fav.albumName}>{fav.albumName}</h3>
                  <p className="album-artist">{fav.artistName}</p>
                  <p className="meta-item">Saved on {new Date(fav.createdAt).toLocaleDateString()}</p>

                  <div className="album-card-actions">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemoveFavorite(fav.id, fav.spotifyAlbumId)}
                    >
                      🗑️ Remove
                    </button>
                    <a
                      href={`https://open.spotify.com/album/${fav.spotifyAlbumId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                    >
                      Spotify ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAlbum && (
        <AlbumDetails
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          isFavorite={true}
          isLoggedIn={true}
        />
      )}
    </div>
  );
}
