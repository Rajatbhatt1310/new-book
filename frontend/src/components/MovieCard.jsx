import { Link, useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  function openTheaters() {
    navigate(`/theaters/${movie.id}`);
  }

  const genreText =
    movie.genres?.length > 0
      ? movie.genres.map((genre) => genre.name).join(", ")
      : "Cinema";

  const languageText =
    movie.language?.name || "Multi-language";

  return (
    <article className="movie-card" onClick={openTheaters}>
      <div className="poster-frame">
        {movie.image ? (
          <img src={movie.image} alt={`${movie.name} poster`} />
        ) : (
          <div className="poster-fallback">{movie.name}</div>
        )}

        <span className="rating-badge">
          {movie.rating || "New"} / 10
        </span>
      </div>

      <div className="movie-card-body">
        <h3>{movie.name}</h3>

        <p>
          {genreText} · {languageText}
        </p>

        <div className="card-actions">
          <button
            className="btn btn-danger"
            type="button"
          >
            Book
          </button>

          <Link
            className="text-link"
            to={`/movie/${movie.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;