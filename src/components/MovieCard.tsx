import React from "react";
import type { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center bg-white/10 rounded-2xl shadow-xl p-6 relative">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
        alt={movie.Title}
        className="w-40 h-60 object-cover rounded-xl shadow-lg border-4 border-indigo-400 bg-gray-300"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-2">
          {movie.Title} <span className="text-gray-300 font-normal">({movie.Year})</span>
        </h2>
        {movie.Plot && <p className="text-gray-200 mb-2">{movie.Plot}</p>}
        <div className="flex flex-wrap gap-4 text-gray-200 text-sm">
          <span>
            <strong>Box Office:</strong> {movie.BoxOffice ?? "N/A"}
          </span>
          <span>
            <strong>IMDB Rating:</strong> <span className="text-yellow-400">{movie.imdbRating ?? "N/A"}</span>
          </span>
          <span>
            <strong>Genre:</strong> {movie.Genre ?? "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
