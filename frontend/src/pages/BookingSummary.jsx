import { Link, useLocation } from "react-router-dom";
import { formatCurrency, getBookings } from "../utils/booking.js";

function BookingSummary() {
  const location = useLocation();
  const booking = location.state?.booking || getBookings()[0];

  if (!booking) {
    return (
      <section className="container page-state">
        <div className="state-card">
          <h1>No confirmed booking found</h1>
          <Link className="btn btn-primary" to="/movies">
            Browse Movies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container summary-page">
      <div className="confirmation-card">
        <span className="confirmation-mark">Confirmed</span>
        <h1>Booking confirmed</h1>
        <p className="muted">Booking ID: {booking.id}</p>
        {booking.email_status === "queued" && (
          <p className="muted">
            Confirmation email has been queued and will be sent shortly.
          </p>
        )}
        <div className="summary-stack">
          <div className="summary-line">
            <span>Movie</span>
            <strong>{booking.movie?.name || booking.movie}</strong>
          </div>
          <div className="summary-line">
            <span>Theater</span>
            <strong>{booking.theater?.name || booking.theater}</strong>
          </div>
          <div className="summary-line">
            <span>Seats</span>
            <strong>
              {(booking.selectedSeats || [])
                .map((seat) => seat.seat_number)
                .join(", ") || booking.seat_numbers?.join(", ")}
            </strong>
          </div>
          <div className="summary-line total">
            <span>Paid</span>
            <strong>{formatCurrency(booking.total || booking.total_amount)}</strong>
          </div>
        </div>
        <div className="button-row centered">
          <Link className="btn btn-primary" to="/">
            Home
          </Link>
          <Link className="btn btn-ghost" to="/profile">
            View Profile
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BookingSummary;
