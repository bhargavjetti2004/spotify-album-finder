import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import MoodFinder from './components/MoodFinder';
import AlbumComparison from './components/AlbumComparison';
import AlbumDetails from './components/AlbumDetails';
import { authService } from './services/auth';
import api from './services/api';
import './App.css';

// Protected Route Wrapper
function ProtectedRoute({ children, user }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [favorites, setFavorites] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});
  const [selectedAlbumModal, setSelectedAlbumModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoritesMap({});
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
      const map = {};
      response.data.forEach((fav) => {
        map[fav.spotifyAlbumId] = fav.id;
      });
      setFavoritesMap(map);
    } catch {
      // User may not be logged in yet
    }
  };

  const handleToggleFavorite = async (album) => {
    if (!user) {
      showToast('⚠️ Please log in or register to save favorite albums.');
      return;
    }

    const existingFavoriteId = favoritesMap[album.id];

    if (existingFavoriteId) {
      // Remove favorite
      try {
        await api.delete(`/favorites/${existingFavoriteId}`);
        setFavorites((prev) => prev.filter((f) => f.id !== existingFavoriteId));
        setFavoritesMap((prev) => {
          const updated = { ...prev };
          delete updated[album.id];
          return updated;
        });
        showToast(`Removed "${album.name}" from favorites`);
      } catch {
        showToast('Failed to remove favorite. Please try again.');
      }
    } else {
      // Add favorite
      try {
        const payload = {
          spotifyAlbumId: album.id,
          albumName: album.name,
          artistName: album.artist,
          albumImage: album.imageUrl,
        };
        const response = await api.post('/favorites', payload);
        const newFav = response.data;
        setFavorites((prev) => [newFav, ...prev]);
        setFavoritesMap((prev) => ({ ...prev, [album.id]: newFav.id }));
        showToast(`❤️ Added "${album.name}" to favorites!`);
      } catch (err) {
        showToast(err.response?.data?.error || 'Failed to save favorite.');
      }
    }
  };

  const handleRemoveFavoriteById = async (favId, spotifyAlbumId) => {
    try {
      await api.delete(`/favorites/${favId}`);
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
      setFavoritesMap((prev) => {
        const updated = { ...prev };
        delete updated[spotifyAlbumId];
        return updated;
      });
      showToast('Album removed from favorites');
    } catch {
      showToast('Failed to remove favorite.');
    }
  };

  const handleLoginSuccess = (authData) => {
    setUser({ name: authData.name, email: authData.email });
    showToast(`Welcome back, ${authData.name}! 🎉`);
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    setFavoritesMap({});
    showToast('Logged out successfully.');
  };

  return (
    <Router>
      <div className="app-root">
        <Navbar user={user} onLogout={handleLogout} />

        {toastMessage && (
          <div className="toast-notification">
            <span>{toastMessage}</span>
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  favoritesMap={favoritesMap}
                  onToggleFavorite={handleToggleFavorite}
                />
              }
            />

            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/register"
              element={<Register onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/mood"
              element={
                <div className="page-wrapper">
                  <MoodFinder
                    onSelectDetails={setSelectedAlbumModal}
                    onToggleFavorite={handleToggleFavorite}
                    favoritesMap={favoritesMap}
                    isLoggedIn={!!user}
                  />
                </div>
              }
            />

            <Route
              path="/compare"
              element={
                <div className="page-wrapper">
                  <AlbumComparison />
                </div>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute user={user}>
                  <Favorites
                    favorites={favorites}
                    onRemoveFavorite={handleRemoveFavoriteById}
                    user={user}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {selectedAlbumModal && (
          <AlbumDetails
            album={selectedAlbumModal}
            onClose={() => setSelectedAlbumModal(null)}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favoritesMap ? !!favoritesMap[selectedAlbumModal.id] : false}
            isLoggedIn={!!user}
          />
        )}

        <footer className="footer">
          <div className="footer-container">
            <p className="footer-brand">🎵 Spotify Album Finder — Mood Finder & Album Comparison</p>
            <p className="footer-credits">
              Built with Spring Boot 3, Java 21, Spring Security, JWT, MySQL, React & Vite.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
