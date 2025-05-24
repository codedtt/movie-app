import React from "react";
import type { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
      <h2>{movie.Title} ({movie.Year})</h2>
      <img src={movie.Poster} alt={movie.Title} style={{ maxWidth: "200px" }} />
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Box Office:</strong> {movie.BoxOffice ?? "N/A"}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating ?? "N/A"}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
    </div>
  );
};

export default MovieCard;
