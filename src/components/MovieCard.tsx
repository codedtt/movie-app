import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isTrailerActive: boolean;
  onWatchTrailer: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isTrailerActive, onWatchTrailer }) => {
  // Extract trailer from Ratings or another source if you have it, here we simulate:
  // You might want to fetch trailer URL by imdbID or have a youtube URL in your data.
  // For now, let's just use a dummy youtube trailer URL for demonstration.
  const trailerUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;

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
        <p className="flex-1 text-sm overflow-auto max-h-48 mb-4">{movie.Plot}</p>
        <p className="mb-1">IMDB Rating: {movie.imdbRating || 'N/A'}</p>
        <p className="flex-1 text-sm overflow-auto max-h-48 mb-4">{movie.BoxOffice}</p>
        <button
          onClick={onWatchTrailer}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded px-4 py-2 font-semibold transition w-max"
        >
          {isTrailerActive ? <X size={16} /> : <Play size={16} />}
          {isTrailerActive ? 'Close Trailer' : 'Watch Trailer'}
        </button>
      </div>
      {isTrailerActive && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 rounded-2xl flex items-center justify-center p-4 z-10">
          <iframe
            width="100%"
            height="315"
            src={trailerUrl}
            title={`${movie.Title} Trailer`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
