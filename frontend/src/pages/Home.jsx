import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AlbumCard from '../components/AlbumCard';
import AlbumDetails from '../components/AlbumDetails';
import MoodFinder from '../components/MoodFinder';
import AlbumComparison from '../components/AlbumComparison';
import api from '../services/api';

export default function Home({ user, favoritesMap, onToggleFavorite }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedAlbumForDetails, setSelectedAlbumForDetails] = useState(null);
  const [compareAlbumsList, setCompareAlbumsList] = useState([]);

  const navigate = useNavigate();

  // Load initial popular discovery albums on page load
  useEffect(() => {
    handleSearch('Taylor Swift');
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setActiveQuery(query);

    try {
      const response = await api.get(`/albums/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (err) {
      setSearchError(err.response?.data?.error || 'Failed to search Spotify. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectForCompare = (album) => {
    setCompareAlbumsList((prev) => {
      const exists = prev.find((a) => a.id === album.id);
      if (exists) {
        return prev.filter((a) => a.id !== album.id);
      }
      if (prev.length >= 2) {
        return [prev[1], album];
      }
      return [...prev, album];
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-pill">🎵 Spotify Music Discovery Platform</span>
          <h1 className="hero-title">Spotify Album Finder</h1>
          <p className="hero-subtitle">
            Discover • Compare • Find Your Mood
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </section>

      {/* Search Results Section */}
      <section className="results-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeQuery ? `Results for "${activeQuery}"` : "Featured Discoveries"}
          </h2>
          <span className="results-count">
            {searchResults.length} {searchResults.length === 1 ? 'album' : 'albums'} found
          </span>
        </div>

        {searchError && (
          <div className="alert alert-error">
            <span>⚠️ {searchError}</span>
          </div>
        )}

        {isSearching ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching Spotify...</p>
          </div>
        ) : (
          <div className="albums-grid">
            {searchResults.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onSelectDetails={setSelectedAlbumForDetails}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoritesMap ? !!favoritesMap[album.id] : false}
                isLoggedIn={!!user}
                onSelectForCompare={handleSelectForCompare}
                isSelectedForCompare={compareAlbumsList.some((a) => a.id === album.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mood Finder Section */}
      <MoodFinder
        onSelectDetails={setSelectedAlbumForDetails}
        onToggleFavorite={onToggleFavorite}
        favoritesMap={favoritesMap}
        isLoggedIn={!!user}
        onSelectForCompare={handleSelectForCompare}
      />

      {/* Quick Compare Section */}
      <AlbumComparison
        initialAlbum1={compareAlbumsList[0] || null}
        initialAlbum2={compareAlbumsList[1] || null}
      />

      {/* Album Details Modal */}
      {selectedAlbumForDetails && (
        <AlbumDetails
          album={selectedAlbumForDetails}
          onClose={() => setSelectedAlbumForDetails(null)}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoritesMap ? !!favoritesMap[selectedAlbumForDetails.id] : false}
          isLoggedIn={!!user}
        />
      )}
    </div>
  );
}
