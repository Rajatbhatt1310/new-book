import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, getBookings } from "../utils/booking.js";

function Profile() {
  const { isAuthenticated, user } = useAuth();
  const bookings = getBookings();

  if (!isAuthenticated) {
    return (
      <section className="container page-state">
        <div className="state-card">
          <h1>Login to view your profile</h1>
          <p>Your bookings and account details will appear here.</p>
          <Link className="btn btn-primary" to="/login">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container profile-page">
      <div className="profile-card">
        <span className="eyebrow">Profile</span>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Bookings</span>
          <h2>Your bookings</h2>
        </div>
        <Link className="btn btn-ghost" to="/movies">
          Book More
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="state-card">No bookings yet.</div>
      ) : (
        <div className="booking-history">
          {bookings.map((booking) => (
            <article className="history-card" key={booking.id}>
              <div>
                <h3>{booking.movie?.name || booking.movie}</h3>
                <p>{booking.theater?.name || booking.theater}</p>
                <p className="muted">
                  Seats:{" "}
                  {(booking.selectedSeats || [])
                    .map((seat) => seat.seat_number)
                    .join(", ") || booking.seat_numbers?.join(", ")}
                </p>
              </div>
              <div className="history-price">
                <strong>{formatCurrency(booking.total || booking.total_amount)}</strong>
                <span>{booking.status}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Profile;
