import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { Heart, HeartOff, Clock, Star, X } from 'lucide-react';
import type { Movie } from '../types';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('movieSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('movieFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('movieSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchMovie = async () => {
    if (!query.trim()) {
      setError("Please enter a movie title.");
      return;
    }

    setError('');
    setMovie(null);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&y=${year}&plot=full&apikey=${apiKey}`;
      const res = await axios.get(url);

      if (res.data.Response === "True") {
        setMovie(res.data);
        setSearchHistory(prev => {
          const filtered = prev.filter(item => item !== query);
          return [query, ...filtered].slice(0, 10);
        });
      } else {
        setError(res.data.Error || "Movie not found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!movie) return;
    const exists = favorites.find(f => f.imdbID === movie.imdbID);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
    } else {
      setFavorites(prev => [movie, ...prev]);
    }
  };

  const isFavorite = (movie: Movie) => favorites.some(f => f.imdbID === movie.imdbID);

  const removeFromHistory = (term: string) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-white">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-extrabold flex items-center gap-2 tracking-wide">
            🎬 <span className="text-indigo-400">Movie Finder</span>
          </h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              fetchMovie();
            }}
            className="flex flex-wrap gap-3"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Movie title"
              className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none backdrop-blur-md"
            />
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              className="w-28 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 font-semibold shadow transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Searches */}
            <div className="bg-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} /> Recent Searches
              </h2>
              {searchHistory.length === 0 ? (
                <p className="text-white/60">No recent searches.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map(term => (
                    <div key={term} className="relative">
                      <button
                        onClick={() => {
                          setQuery(term);
                          fetchMovie();
                        }}
                        className="px-4 py-1 pr-6 rounded-full text-sm bg-indigo-700 text-white hover:bg-indigo-500 transition relative"
                      >
                        {term}
                      </button>
                      <X
                        size={16}
                        className="absolute top-1 right-1 cursor-pointer text-white/80 hover:text-white"
                        onClick={() => removeFromHistory(term)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Display */}
            {movie && (
              <div className="relative">
                <MovieCard movie={movie} />
                <button
                  onClick={toggleFavorite}
                  title={isFavorite(movie) ? "Remove from favorites" : "Add to favorites"}
                  className="absolute top-4 right-4 p-2 rounded-full bg-indigo-900 hover:bg-indigo-700 transition"
                >
                  {isFavorite(movie) ? <HeartOff className="text-red-400" /> : <Heart className="text-pink-400" />}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-600/80 text-white px-4 py-2 rounded shadow">{error}</div>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="text-pink-400" size={18} /> Favorites
            </h2>
            {favorites.length === 0 ? (
              <p className="text-white/60">No favorite movies yet.</p>
            ) : (
              <div className="space-y-4">
                {favorites.map(fav => (
                  <div
                    key={fav.imdbID}
                    className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-indigo-700/40 transition"
                  >
                    <img
                      src={fav.Poster !== "N/A" ? fav.Poster : "/no-poster.png"}
                      alt={fav.Title}
                      className="w-12 h-16 rounded-lg object-cover shadow"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{fav.Title}</p>
                      <p className="text-indigo-200 text-xs">{fav.Year}</p>
                    </div>
                    <button
                      onClick={() => {
                        setMovie(fav);
                        setQuery(fav.Title);
                        setYear(fav.Year);
                      }}
                      className="text-indigo-200 text-xs hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSearch;
