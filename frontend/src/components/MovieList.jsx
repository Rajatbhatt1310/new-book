import { useEffect, useState } from "react";
import MovieCard from "./MovieCard.jsx";
import { getMovieCatalog, getMovies } from "../services/api.js";

function MovieList({ title = "Recommended Movies", limit, movies: givenMovies }) {
  const isFilterPage = !givenMovies && !limit;

  const [movies, setMovies] = useState(givenMovies || []);
  const [isLoading, setIsLoading] = useState(!givenMovies);

  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (givenMovies) {
      setMovies(givenMovies);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    if (isFilterPage) {
      getMovieCatalog({
        genre: selectedGenres,
        language: selectedLanguages,
        sort,
        page,
        page_size: 12,
      }).then((data) => {
        if (isMounted) {
          setMovies(data.results || []);
          setGenres(data.filters?.genres || []);
          setLanguages(data.filters?.languages || []);
          setPagination(data.pagination || null);
          setIsLoading(false);
        }
      });
    } else {
      getMovies().then((data) => {
        if (isMounted) {
          setMovies(data || []);
          setIsLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [givenMovies, isFilterPage, selectedGenres, selectedLanguages, sort, page]);

  function toggleValue(value, setter) {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
    setPage(1);
  }

  function clearFilters() {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSort("name");
    setPage(1);
  }

  const visibleMovies = limit ? movies.slice(0, limit) : movies;

  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Movies</span>
          <h2>{title}</h2>
        </div>
      </div>

      {isFilterPage && (
        <div className="filter-panel">
          <div className="filter-row">
            <div>
              <h3>Genres</h3>
              <div className="filter-chips">
                {genres.map((genre) => (
                  <button
                    key={genre.slug}
                    type="button"
                    className={
                      selectedGenres.includes(genre.slug)
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() => toggleValue(genre.slug, setSelectedGenres)}
                  >
                    {genre.name} ({genre.count})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3>Languages</h3>
              <div className="filter-chips">
                {languages.map((language) => (
                  <button
                    key={language.slug}
                    type="button"
                    className={
                      selectedLanguages.includes(language.slug)
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() =>
                      toggleValue(language.slug, setSelectedLanguages)
                    }
                  >
                    {language.name} ({language.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
            >
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="-rating">Highest rating</option>
              <option value="rating">Lowest rating</option>
              <option value="newest">Newest added</option>
              <option value="oldest">Oldest added</option>
            </select>

            <button className="btn btn-ghost" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="state-card">Loading movies...</div>
      ) : visibleMovies.length > 0 ? (
        <>
          <div className="movie-grid">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {isFilterPage && pagination && (
            <div className="pagination-bar">
              <button
                className="btn btn-ghost"
                type="button"
                disabled={!pagination.has_previous}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.total_pages} ·{" "}
                {pagination.total_results} movies
              </span>

              <button
                className="btn btn-ghost"
                type="button"
                disabled={!pagination.has_next}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="state-card">
          No movies found for the selected filters.
        </div>
      )}
    </section>
  );
}

export default MovieList;