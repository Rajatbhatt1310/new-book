import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrailerEmbed from "../components/TrailerEmbed.jsx";
import { getMovie, getTheaters } from "../services/api.js";

function TheaterList() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    getMovie(movieId).then(setMovie);
    getTheaters(movieId).then((data) => setTheaters(data || []));
  }, [movieId]);

  return (
    <section className="container theater-page">
      <div className="page-heading">
        <span className="eyebrow">Choose Theater</span>
        <h1>{movie?.name || "Movie"}</h1>
        <p>{movie?.description}</p>
      </div>

      <div className="theater-layout">
        <div className="theater-list">
          {theaters.length === 0 ? (
            <div className="state-card">No theaters found for this movie.</div>
          ) : (
            theaters.map((theater) => (
              <article className="theater-card" key={theater.id}>
                <div>
                  <h3>{theater.name}</h3>
                  <p>Showtime: {theater.time}</p>
                </div>
                <Link className="btn btn-primary" to={`/seats/${theater.id}`}>
                  Select Seats
                </Link>
              </article>
            ))
          )}
        </div>
        <aside className="trailer-panel">
          <h2>Trailer</h2>
          <TrailerEmbed
            url={movie?.trailer_embed_url || movie?.trailer_url}
            title={`${movie?.name || "Movie"} trailer`}
          />
        </aside>
      </div>
    </section>
  );
}

export default TheaterList;
