import React, { useState } from 'react';

export default function SearchBar({ onSearch, isLoading, placeholder = "Search albums or artists (e.g., Taylor Swift, Coldplay)..." }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
        {query && (
          <button type="button" className="clear-btn" onClick={handleClear} title="Clear search">
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-primary search-submit-btn" disabled={isLoading || !query.trim()}>
        {isLoading ? 'Searching Spotify...' : 'Search'}
      </button>
    </form>
  );
}
