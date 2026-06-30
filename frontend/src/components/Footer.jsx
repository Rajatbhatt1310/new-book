import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">BookMySeat</div>
          <p>
            Movie tickets, theater choices, seats, and booking confirmation in a
            simple practical flow.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/movies">Recommended Movies</Link>
          <Link to="/">Live Events</Link>
          <Link to="/">Premiere</Link>
        </div>
        <div>
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
      <div className="footer-bottom">Built for BookMySeat ticket booking.</div>
    </footer>
  );
}

export default Footer;
