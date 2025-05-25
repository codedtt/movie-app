export interface Movie {
  Title: string;
  Year: string;
  Plot?: string;
  BoxOffice?: string;
  imdbRating?: string;
  Poster: string;
  Genre?: string;
  [key: string]: any;
}