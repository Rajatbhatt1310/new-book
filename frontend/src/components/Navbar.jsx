import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">B</span>
          <span>BookMySeat</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/movies" onClick={closeMenu}>
            Movies
          </NavLink>
          <NavLink to="/profile" onClick={closeMenu}>
            Profile
          </NavLink>
        </div>

        <div className={`nav-actions ${isOpen ? "open" : ""}`}>
          {isAuthenticated ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="btn btn-ghost" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
