import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieList from "../components/MovieList.jsx";
import TrailerEmbed from "../components/TrailerEmbed.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  liveEvents,
  musicStudio,
  promoBanners,
} from "../data/dummyData.js";
import { getMovies } from "../services/api.js";

function ImageStrip({ title, eyebrow, items }) {
  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="horizontal-list">
        {items.map((item) => (
          <article className="event-card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [movies, setMovies] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getMovies().then((data) => setMovies(data || []));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) => (current + 1) % promoBanners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const banner = promoBanners[activeBanner];
  const trailerMovie =
    movies.find((item) => item.trailer_embed_url || item.trailer_url) ||
    movies[0];

  return (
    <>
      <section className="promo-section container">
        <div className="promo-banner">
          <img src={banner.image} alt={banner.title} />

          <div className="promo-content">
            <span className="eyebrow">BookMySeat</span>
            <h1>{banner.title}</h1>
            <p>{banner.subtitle}</p>

            <Link className="btn btn-primary" to="/movies">
              {banner.cta}
            </Link>
          </div>

          <div className="promo-dots" aria-label="Promo carousel">
            {promoBanners.map((item, index) => (
              <button
                className={index === activeBanner ? "active" : ""}
                key={item.id}
                type="button"
                aria-label={`Show ${item.title}`}
                onClick={() => setActiveBanner(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="container">
          <div className="auth-alert">
            <div>
              <strong>Login or register to complete bookings.</strong>
              <p>Browse movies freely, then sign in before confirming seats.</p>
            </div>

            <div className="auth-alert-actions">
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Register
              </Link>
            </div>
          </div>
        </section>
      )}

      <MovieList title="Recommended Movies" limit={6} movies={movies} />

      <ImageStrip
        title="The Best of Live Events"
        eyebrow="Events"
        items={liveEvents}
      />

      <section className="section premiere-section">
        <div className="container">
          <div className="section-heading inverted">
            <div>
              <span className="eyebrow">Premiere</span>
              <h2>Premiere movies this week</h2>
            </div>
          </div>

          <MovieList title="Premiere Picks" limit={4} movies={movies.slice(1)} />
        </div>
      </section>

      <ImageStrip
        title="Your Music Studio"
        eyebrow="Music"
        items={musicStudio}
      />

      <section className="section container">
        <div className="trailer-section">
          <div>
            <span className="eyebrow">Trailer</span>
            <h2>{trailerMovie?.name || "Featured Movie"}</h2>
            <p>A quick preview before you book your seats.</p>
          </div>

          <TrailerEmbed
            url={trailerMovie?.trailer_embed_url || trailerMovie?.trailer_url}
            title={`${trailerMovie?.name || "Featured Movie"} trailer`}
          />
        </div>
      </section>
    </>
  );
}

export default Home;