import axios from 'axios';
import { searchFallback, getMoodFallback, compareFallback, FALLBACK_ALBUMS } from './catalog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://spotify-album-finder-rslt.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful offline & Vercel fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If network error (backend not running locally or blocked on Vercel)
    if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      const url = originalRequest.url || '';

      if (url.includes('/albums/search')) {
        const urlObj = new URL(url, 'http://localhost');
        const query = urlObj.searchParams.get('query') || '';
        return Promise.resolve({ data: searchFallback(query) });
      }

      if (url.includes('/albums/mood/')) {
        const parts = url.split('/albums/mood/');
        const mood = parts[1] ? parts[1].split('?')[0] : 'happy';
        return Promise.resolve({ data: getMoodFallback(mood) });
      }

      if (url.includes('/albums/compare')) {
        const urlObj = new URL(url, 'http://localhost');
        const id1 = urlObj.searchParams.get('id1') || '';
        const id2 = urlObj.searchParams.get('id2') || '';
        return Promise.resolve({ data: compareFallback(id1, id2) });
      }

      if (url.includes('/albums/')) {
        const parts = url.split('/albums/');
        const id = parts[1] ? parts[1].split('?')[0] : '';
        const album = FALLBACK_ALBUMS.find((a) => a.id === id) || FALLBACK_ALBUMS[0];
        return Promise.resolve({ data: album });
      }

      if (url.includes('/favorites')) {
        const localFavs = JSON.parse(localStorage.getItem('local_favorites') || '[]');
        return Promise.resolve({ data: localFavs });
      }

      if (url.includes('/history')) {
        const localHist = JSON.parse(localStorage.getItem('local_history') || '[]');
        return Promise.resolve({ data: localHist });
      }
    }

    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
