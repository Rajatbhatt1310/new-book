import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  confirmLockedBooking,
  createPaymentOrder,
  verifyPayment,
} from "../services/api.js";
import {
  clearPendingBooking,
  formatCurrency,
  getPendingBooking,
  saveBooking,
} from "../utils/booking.js";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const rawBooking = location.state || getPendingBooking();

  const booking = rawBooking
    ? {
        ...rawBooking,
        locked_until:
          rawBooking.locked_until ||
          rawBooking.lockedUntil ||
          new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      }
    : null;

  const [contact, setContact] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (!booking?.locked_until) return;

    function updateTimer() {
      const expiryTime = new Date(booking.locked_until).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));

      setSecondsLeft(diff);

      if (diff === 0) {
        setMessage("Seat reservation expired. Please select seats again.");
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [booking?.locked_until]);

  async function handlePayment(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      setMessage("Please login or register before confirming your booking.");
      return;
    }

    if (!booking) {
      setMessage("No booking found. Please select seats again.");
      return;
    }

    if (secondsLeft === 0) {
      setMessage("Seat reservation expired. Please select seats again.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const selectedSeatIds = booking.selectedSeats.map((seat) => seat.id);
      const selectedSeatNumbers = booking.selectedSeats.map(
        (seat) => seat.seat_number
      );

      const paymentPayload = {
        movie: booking.movie?.id,
        theater: booking.theater?.id,
        seats: selectedSeatIds,
        seat_numbers: selectedSeatNumbers,
        amount: booking.total,
        contact,
      };

      const orderResponse = await createPaymentOrder(paymentPayload);

      if (!orderResponse || orderResponse.error) {
        setMessage(orderResponse?.error || "Unable to start payment.");
        return;
      }

      if (orderResponse.status === "expired") {
        setMessage("Payment session expired. Please select seats again.");
        return;
      }

      const verifyPayload = {
        razorpay_order_id: orderResponse.order_id,
        razorpay_payment_id: `pay_sim_${Date.now()}`,
      };

      const verifyResponse = await verifyPayment(verifyPayload);

      if (!verifyResponse || verifyResponse.error) {
        setMessage(
          verifyResponse?.error ||
            "Payment verification failed. Booking not confirmed."
        );
        return;
      }

      if (
        verifyResponse.status !== "verified" &&
        verifyResponse.status !== "already_verified"
      ) {
        setMessage("Payment was not verified. Booking not confirmed.");
        return;
      }

      if (secondsLeft === 0) {
        setMessage(
          "Seat reservation expired after payment. Please contact support."
        );
        return;
      }

      const bookingPayload = {
        movie: booking.movie?.id,
        theater: booking.theater?.id,
        seats: selectedSeatIds,
        seat_numbers: selectedSeatNumbers,
        total_amount: booking.total,
        contact,
        payment_id:
          verifyResponse.razorpay_payment_id ||
          verifyPayload.razorpay_payment_id,
        order_id: orderResponse.order_id,
        booked_at: new Date().toISOString(),
      };

      const bookingResponse = await confirmLockedBooking(bookingPayload);

      if (!bookingResponse || bookingResponse.error) {
        setMessage(
          bookingResponse?.error ||
            "Payment successful, but booking confirmation failed."
        );
        return;
      }

      const confirmedBooking = {
        ...booking,
        ...bookingResponse,
        user,
        contact,
        payment_id: bookingPayload.payment_id,
        order_id: orderResponse.order_id,
        id: bookingResponse?.id || `BMS-${Date.now()}`,
        status: bookingResponse?.status || "Confirmed",
      };

      saveBooking(confirmedBooking);
      clearPendingBooking();

      navigate("/booking-summary", {
        state: {
          booking: confirmedBooking,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setMessage(
        "Something went wrong during payment. Booking was not confirmed."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!booking) {
    return (
      <section className="container page-state">
        <div className="state-card">
          <h1>No booking in progress</h1>
          <p>Pick a movie and select seats to continue.</p>
          <Link className="btn btn-primary" to="/movies">
            Browse Movies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container booking-page">
      <div className="page-heading">
        <span className="eyebrow">Booking</span>
        <h1>Confirm your booking</h1>
        <p>
          {booking.movie?.name} · {booking.theater?.name}
        </p>
      </div>

      <div className="booking-layout">
        <form className="form-card" onSubmit={handlePayment}>
          <div className="form-message">
            Reservation expires in {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, "0")}
          </div>

          <label htmlFor="contact">
            Contact email or phone
            <input
              id="contact"
              name="contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          {!isAuthenticated && (
            <div className="auth-alert compact">
              <div>
                <strong>Login required</strong>
                <p>Sign in to confirm and save this booking.</p>
              </div>

              <Link className="btn btn-primary" to="/login">
                Login
              </Link>
            </div>
          )}

          {message && <p className="form-message">{message}</p>}

          <button
            className="btn btn-danger full-width"
            type="submit"
            disabled={isSaving || secondsLeft === 0}
          >
            {isSaving ? "Processing Payment..." : "Pay & Confirm Booking"}
          </button>
        </form>

        <aside className="booking-panel">
          <h2>Summary</h2>

          <div className="summary-line">
            <span>Reservation expires in</span>
            <strong>
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </strong>
          </div>

          <div className="summary-line">
            <span>Movie</span>
            <strong>{booking.movie?.name}</strong>
          </div>

          <div className="summary-line">
            <span>Theater</span>
            <strong>{booking.theater?.name}</strong>
          </div>

          <div className="summary-line">
            <span>Seats</span>
            <strong>
              {booking.selectedSeats.map((seat) => seat.seat_number).join(", ")}
            </strong>
          </div>

          <div className="summary-line">
            <span>Tickets</span>
            <strong>{formatCurrency(booking.ticketPrice)} each</strong>
          </div>

          <div className="summary-line total">
            <span>Total</span>
            <strong>{formatCurrency(booking.total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default BookingPage;