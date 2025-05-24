import { useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

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

        {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}

       {movie && <MovieCard movie={movie} />}
    </div>
  );
};

export default MovieSearch;
