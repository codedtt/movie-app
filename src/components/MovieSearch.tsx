import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { Heart, HeartOff, Clock, X } from 'lucide-react';
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

  const [sortBy, setSortBy] = useState('title');
  const [genreFilter, setGenreFilter] = useState('');
  const [activeTrailer, setActiveTrailer] = useState(false);
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('movieSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (m: Movie) => favorites.some(f => f.imdbID === m.imdbID);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a movie title.');
      return;
    }

    setError('');
    setMovie(null);
    setLoading(true);
    setActiveTrailerId(null);

    try {
      const apiKey = import.meta.env.OMDB_API_KEY;
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&y=${year}&plot=full&apikey=${apiKey}`;
      const res = await axios.get(url);

      if (res.data.Response === 'True') {
        setMovie(res.data);
        setSearchHistory(prev => {
          const updated = [query, ...prev.filter(term => term !== query)];
          return updated.slice(0, 10);
        });
      } else {
        setError(res.data.Error || 'Movie not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!movie) return;

    setFavorites(prev => {
      const exists = isFavorite(movie);
      const updated = exists
        ? prev.filter(f => f.imdbID !== movie.imdbID)
        : [movie, ...prev];

      if (exists && activeTrailerId === movie.imdbID) {
        setActiveTrailerId(null);
      }

      localStorage.setItem('movieFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromHistory = (term: string) => {
    setSearchHistory(prev => prev.filter(item => item !== term));
  };

  const filteredFavorites = favorites
    .filter(f => !genreFilter || f.Genre?.toLowerCase().includes(genreFilter.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.Title.localeCompare(b.Title);
        case 'title-desc':
          return b.Title.localeCompare(a.Title);
        case 'year':
          return parseInt(b.Year) - parseInt(a.Year);
        case 'year-asc':
          return parseInt(a.Year) - parseInt(b.Year);
        case 'rating':
          return parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0');
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] py-6">
      <div className="w-full max-w-8xl p-4 sm:p-6 md:px-12 md:py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
        
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-extrabold flex items-center gap-2 tracking-wide">
            🎬 <span className="text-indigo-400">Movie Finder</span>
          </h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-wrap gap-3"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Movie title"
              className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />
            <input
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Year"
              className="w-28 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 font-semibold shadow transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Section */}
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
                          handleSearch();
                        }}
                        className="px-4 py-1 pr-6 rounded-full text-sm bg-indigo-700 text-white hover:bg-indigo-500 transition"
                      >
                        {term}
                      </button>
                      <X
                        size={16}
                        className="absolute top-1 right-1 cursor-pointer text-white/80 hover:text-white"
                        onClick={() => handleRemoveFromHistory(term)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Result */}
            {movie && (
              <div className="relative">
                <MovieCard
                  movie={movie}
                  isTrailerActive={activeTrailer}
                  onWatchTrailer={setActiveTrailer}
                />
                <button
                  onClick={handleToggleFavorite}
                  title={isFavorite(movie) ? 'Remove from favorites' : 'Add to favorites'}
                  className="absolute top-4 right-4 p-2 rounded-full bg-indigo-900 hover:bg-indigo-700 transition"
                >
                  {isFavorite(movie) ? (
                    <HeartOff className="text-red-400" />
                  ) : (
                    <Heart className="text-pink-400" />
                  )}
                </button>
              </div>
            )}

            {error && <div className="bg-red-600/80 text-white px-4 py-2 rounded shadow">{error}</div>}
          </div>

          {/* Favorites */}
          <div className="bg-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="text-pink-400" size={20} /> Favorites
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-blue/10 text-white px-4 py-2 rounded-lg"
                >
                  <option value="title">Sort by Title (A-Z)</option>
                  <option value="title-desc">Sort by Title (Z-A)</option>
                  <option value="year">Sort by Year (Newest)</option>
                  <option value="year-asc">Sort by Year (Oldest)</option>
                  <option value="rating">Sort by IMDB Rating</option>
                </select>
               <div className="flex-1 min-w-[100px]">
                  <input
                    type="text"
                    value={genreFilter}
                    onChange={e => setGenreFilter(e.target.value)}
                    placeholder="Genre"
                    className="
                      w-full
                      bg-white/10
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      placeholder-white/70
                      focus:outline-none
                      focus:bg-white/20
                      transition
                      duration-200
                    "
                    aria-label="Filter favorites by genre"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <p className="text-white/60">No favorite movies yet.</p>
            ) : (
              <div className="space-y-4">
                {filteredFavorites.map(fav => (
                  <div key={fav.imdbID} className="relative flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-indigo-700/40 transition">
                    <img
                      src={fav.Poster !== 'N/A' ? fav.Poster : '/no-poster.png'}
                      alt={fav.Title}
                      className="w-12 h-16 rounded-lg object-cover shadow bg-white/20"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{fav.Title}</p>
                      <p className="text-indigo-200 text-xs">{fav.Year}</p>
                      <p className="text-white/70 text-xs">{fav.Genre}</p>
                    </div>
                    <button
                      onClick={() => {
                        setMovie(fav);
                        setQuery(fav.Title);
                        setYear(fav.Year);
                        setActiveTrailerId(null);
                      }}
                      className="ml-2 px-2 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        const updated = favorites.filter(f => f.imdbID !== fav.imdbID);
                        setFavorites(updated);
                        localStorage.setItem('movieFavorites', JSON.stringify(updated));
                        if (activeTrailerId === fav.imdbID) setActiveTrailerId(null);
                      }}
                      title="Remove from favorites"
                      className="ml-2 p-1 rounded-full bg-red-800/70 hover:bg-red-700 transition"
                    >
                      <HeartOff className="text-red-300" size={18} />
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
