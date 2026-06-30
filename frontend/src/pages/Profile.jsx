import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getMyBookings } from "../services/api.js";
import { formatCurrency } from "../utils/booking.js";

function Profile() {
  const { isAuthenticated, user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function loadBookings() {
      try {
        const data = await getMyBookings();
        setBookings(data || []);
      } catch (error) {
        console.error("Failed to load bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [isAuthenticated]);

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
          <h2>Your Bookings</h2>
        </div>

        <Link className="btn btn-ghost" to="/movies">
          Book More
        </Link>
      </div>

      {loading ? (
        <div className="state-card">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="state-card">
          No bookings found for your account.
        </div>
      ) : (
        <div className="booking-history">
          {bookings.map((booking) => (
            <article className="history-card" key={booking.id}>
              <div>
                <h3>{booking.movie.name}</h3>

                <p>{booking.theater.name}</p>

                <p className="muted">
                  Seats:{" "}
                  {booking.selectedSeats
                    .map((seat) => seat.seat_number)
                    .join(", ")}
                </p>

                {booking.booked_at && (
                  <p className="muted">
                    {new Date(booking.booked_at).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="history-price">
                <strong>{formatCurrency(booking.total)}</strong>

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