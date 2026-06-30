import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrailerEmbed from "../components/TrailerEmbed.jsx";
import { getMovie } from "../services/api.js";

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovie(movieId).then(setMovie);
  }, [movieId]);

  if (!movie) {
    return <div className="container state-card page-state">Loading movie...</div>;
  }

  return (
    <section className="container detail-layout">
      <div className="detail-poster">
        <img src={movie.image} alt={`${movie.name} poster`} />
      </div>
      <div className="detail-content">
        <span className="eyebrow">{movie.genre || "Movie"}</span>
        <h1>{movie.name}</h1>
        <div className="meta-row">
          <span>{movie.rating || "New"} / 10</span>
          <span>{movie.language || "Multi-language"}</span>
          <span>{movie.duration || "2h"}</span>
        </div>
        <p>{movie.description}</p>
        <p className="muted">Cast: {movie.cast || "Cast details unavailable"}</p>
        <div className="button-row">
          <Link className="btn btn-danger" to={`/theaters/${movie.id}`}>
            Book Tickets
          </Link>
          <Link className="btn btn-ghost" to="/movies">
            Back to Movies
          </Link>
        </div>
        <TrailerEmbed
          url={movie?.trailer_embed_url || movie?.trailer_url}
          title={`${movie?.name || "Movie"} trailer`}
        />

      </div>
    </section>
  );
}

export default MovieDetail;
