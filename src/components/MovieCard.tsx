import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isTrailerActive: boolean;
  onWatchTrailer: (active: boolean) => void;
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MovieCard: React.FC<MovieCardProps> = ({ movie, isTrailerActive, onWatchTrailer }) => {
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState('');

  const buildYouTubeQuery = (movie: Movie) => {
    const cast = movie.Actors ? movie.Actors.split(',').slice(0, 2).join(' ') : '';
    return `${movie.Title} ${movie.Year} ${movie.Genre} ${cast} official trailer`;
  };

  const fetchTrailer = async () => {
    setTrailerId(null);
    setTrailerError('');
    setLoadingTrailer(true);

    try {
      const query = buildYouTubeQuery(movie);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&videoEmbeddable=true&q=${encodeURIComponent(
        query
      )}&key=${YOUTUBE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log('YouTube response:', data);
      if (data.items?.length) {
        setTrailerId(data.items[0].id.videoId);
      } else {
        setTrailerError('Trailer not found.');
      }
    } catch {
      setTrailerError('Error fetching trailer.');
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleTrailerToggle = async () => {
    if (!isTrailerActive) {
      await fetchTrailer();
      onWatchTrailer(true);
    } else {
      resetTrailer();
    }
  };

  const handleCloseTrailer = () => resetTrailer();

  const resetTrailer = () => {
    setTrailerId(null);
    setTrailerError('');
    setLoadingTrailer(false);
    onWatchTrailer(false);
  };

  return (
    <div className="bg-white/10 rounded-2xl p-6 shadow-lg relative text-white flex flex-col md:flex-row gap-6">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.Title}
        className="w-full md:w-48 rounded-lg object-cover"
      />

      <div className="flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2">{movie.Title} ({movie.Year})</h3>
        <p className="mb-2 italic">{movie.Genre}</p>
        <p className="mb-2"><b>Director:</b> {movie.Director}</p>
        <p className="mb-2"><b>Writer:</b> {movie.Writer}</p>
        <p className="mb-2"><b>Actors:</b> {movie.Actors}</p>
        <p className="mb-2"><b>Box Office:</b> {movie.BoxOffice && movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'Not available'}</p>
        <p className="mb-2"><b>Awards:</b> {movie.Awards}</p>
        <p className="mb-2"><b>Runtime:</b> {movie.Runtime}</p>
        <p className="mb-2"><b>Rated:</b> {movie.Rated}</p>
        <p className="mb-4 text-sm">{movie.Plot}</p>

        <div className="flex flex-wrap gap-4 mb-4">
          <span><b>IMDb:</b> {movie.imdbRating || 'N/A'}</span>
          {movie.Ratings?.map((rating: any) => (
            <span key={rating.Source}><b>{rating.Source}:</b> {rating.Value}</span>
          ))}
        </div>

        <button
          onClick={handleTrailerToggle}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded px-4 py-2 font-semibold transition w-max"
        >
          {isTrailerActive ? <X size={16} /> : <Play size={16} />}
          {isTrailerActive ? 'Close Trailer' : loadingTrailer ? 'Loading...' : 'Watch Trailer'}
        </button>
      </div>

      {isTrailerActive && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 rounded-2xl flex items-center justify-center p-4 z-10">
          <button
            onClick={handleCloseTrailer}
            className="absolute top-4 right-4 bg-red-600 rounded-full p-2"
            aria-label="Close Trailer"
          >
            <X size={24} />
          </button>

          {loadingTrailer ? (
            <div className="text-white text-lg">Loading trailer...</div>
          ) : trailerId ? (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
              title={`${movie.Title} Trailer`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="text-white text-lg">{trailerError || 'Trailer not found.'}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
