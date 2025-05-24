import { useState } from 'react';
import axios from 'axios';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState('');

const fetchMovie = async () => {
  setError('');
  setMovie(null);

  if (!query.trim()) {
    setError("🎬 Please enter a movie title.");
    return;
  }

  try {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    let url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;
    if (year) url += `&y=${encodeURIComponent(year)}`;

    const response = await axios.get(url);

    if (response.data.Response === "True") {
      setMovie(response.data);
    } else {
      setError(`❌ ${response.data.Error || "Movie not found."}`);
    }
  } catch (err) {
    setError("⚠️ Something went wrong. Please check your internet connection or try again later.");
    console.error("API Error:", err);
  }
};

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>🎬 Movie Search</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Enter movie title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          placeholder="Year (optional)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={fetchMovie}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {movie && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h2>{movie.Title} ({movie.Year})</h2>
          <img src={movie.Poster} alt={movie.Title} style={{ width: "200px" }} />
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Box Office:</strong> {movie.BoxOffice || 'N/A'}</p>
          <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
