import { useState } from 'react';
import axios from 'axios';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchMovie = async () => {
    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const res = await axios.get(`https://www.omdbapi.com/?t=${query}&apikey=${apiKey}`);
      if (res.data.Response === "True") {
        setMovie(res.data);
        setError('');
      } else {
        setError('Movie not found!');
        setMovie(null);
      }
    } catch (err) {
      setError('Error fetching movie data.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter movie title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchMovie}>Search</button>

      {error && <p>{error}</p>}

      {movie && (
        <div>
          <h2>{movie.Title}</h2>
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
          <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
          <img src={movie.Poster} alt={movie.Title} />
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
