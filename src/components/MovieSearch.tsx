import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('movieSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movieSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fetchMovie = async (searchQuery = query, searchYear = year) => {
    setError('');
    setMovie(null);

    if (!searchQuery.trim()) {
      setError("🎬 Please enter a movie title.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      let url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`;
      if (searchYear) url += `&y=${encodeURIComponent(searchYear)}`;

      const response = await axios.get(url);

      if (response.data.Response === "True") {
        setMovie(response.data);
        setSearchHistory((prev) => {
          const filtered = prev.filter(item => item.toLowerCase() !== searchQuery.toLowerCase());
          return [searchQuery, ...filtered].slice(0, 10);
        });
      } else {
        setError(`❌ ${response.data.Error || "Movie not found."}`);
      }
    } catch (err) {
      setError("⚠️ Something went wrong. Please check your internet connection or try again later.");
      console.error("API Error:", err);
    }
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    setYear('');
    fetchMovie(term, '');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      {/* Left Pane: Search and History */}
      <div
        style={{
          width: '50%',
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#343a40" }}>
            🎬 Movie Search
          </h1>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input
              placeholder="Enter movie title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1.5px solid #ced4da",
                outline: "none",
                minWidth: "180px"
              }}
            />
            <input
              placeholder="Year (optional)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                width: "120px",
                padding: "0.6rem 1rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1.5px solid #ced4da",
                outline: "none"
              }}
            />
            <button
              onClick={() => fetchMovie()}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.65rem 1.25rem",
                fontSize: "1rem",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Search
            </button>
          </div>

          {searchHistory.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: "0.5rem", color: "#495057" }}>Recent Searches</h4>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {searchHistory.map((term, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '1rem'
                      }}
                      onClick={() => handleHistoryClick(term)}
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div style={{ color: "#dc3545", marginBottom: "1.5rem", textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: MovieCard or Placeholder */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#212529',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}
      >
        {movie ? (
          <MovieCard movie={movie} />
        ) : (
          <div style={{ fontSize: '1.5rem', opacity: 0.6, textAlign: 'center' }}>
            🔎 Search for a movie and see details here.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
