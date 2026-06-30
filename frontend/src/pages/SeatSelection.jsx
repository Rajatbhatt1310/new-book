import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMovie, getSeats, getTheater, lockSeats } from "../services/api.js";
import { formatCurrency, savePendingBooking } from "../utils/booking.js";

const TICKET_PRICE = 220;
const CONVENIENCE_FEE = 30;

function SeatSelection() {
  const { theaterId } = useParams();
  const navigate = useNavigate();

  const [theater, setTheater] = useState(null);
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSeatData() {
      const theaterData = await getTheater(theaterId);
      const movieKey =
        typeof theaterData.movie === "object"
          ? theaterData.movie.id
          : theaterData.movie;

      setTheater(theaterData);
      setSeats((await getSeats(theaterId)) || []);
      setMovie(await getMovie(movieKey));
    }

    loadSeatData();
  }, [theaterId]);

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedIds.includes(seat.id)),
    [seats, selectedIds]
  );

  const total =
    selectedSeats.length * TICKET_PRICE +
    (selectedSeats.length > 0 ? CONVENIENCE_FEE : 0);

  function toggleSeat(seat) {
    if (seat.is_booked || (seat.is_locked && !seat.locked_by_me)) {
      return;
    }

    setMessage("");

    setSelectedIds((current) =>
      current.includes(seat.id)
        ? current.filter((id) => id !== seat.id)
        : [...current, seat.id]
    );
  }

  async function continueBooking() {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }

    const response = await lockSeats({
      theater: Number(theaterId),
      seats: selectedSeats.map((seat) => seat.id),
    });

    if (!response || response.error) {
      setMessage(response?.error || "Could not reserve seats.");
      return;
    }
    console.log("LOCK RESPONSE:", response);
    const pendingBooking = {
      theater,
      movie,
      selectedSeats,
      ticketPrice: TICKET_PRICE,
      convenienceFee: CONVENIENCE_FEE,
      total,
      locked_until:
        response.locked_until ||
        new Date(Date.now() + 2 * 60 * 1000).toISOString(),
    };

    savePendingBooking(pendingBooking);
    navigate(`/booking/${theaterId}`, { state: pendingBooking });
  }

  return (
    <section className="container seat-page">
      <div className="page-heading">
        <span className="eyebrow">Seat Selection</span>
        <h1>{movie?.name || "Choose seats"}</h1>
        <p>
          {theater?.name} · {theater?.time}
        </p>
      </div>

      <div className="seat-layout">
        <div className="seat-map-card">
          <div className="screen">Screen</div>

          <div className="seat-grid">
            {seats.map((seat) => {
              const selected = selectedIds.includes(seat.id);
              const locked = seat.is_locked && !seat.locked_by_me;

              return (
                <button
                  className={`seat ${seat.is_booked ? "booked" : ""} ${locked ? "locked" : ""
                    } ${selected ? "selected" : ""}`}
                  key={seat.id}
                  type="button"
                  disabled={seat.is_booked || locked}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat.seat_number}
                </button>
              );
            })}
          </div>

          <div className="seat-legend">
            <span><i className="seat-key available" /> Available</span>
            <span><i className="seat-key selected" /> Selected</span>
            <span><i className="seat-key booked" /> Booked</span>
            <span><i className="seat-key locked" /> Locked</span>
          </div>
        </div>

        <aside className="booking-panel">
          <h2>Booking Preview</h2>

          <p className="muted">
            Seats:{" "}
            {selectedSeats.length
              ? selectedSeats.map((seat) => seat.seat_number).join(", ")
              : "None selected"}
          </p>

          <div className="summary-line">
            <span>Ticket price</span>
            <strong>{formatCurrency(TICKET_PRICE)}</strong>
          </div>

          <div className="summary-line">
            <span>Convenience fee</span>
            <strong>
              {selectedSeats.length ? formatCurrency(CONVENIENCE_FEE) : "-"}
            </strong>
          </div>

          <div className="summary-line total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          {message && <p className="form-message">{message}</p>}

          <button className="btn btn-danger full-width" onClick={continueBooking}>
            Continue
          </button>

          <Link className="text-link centered" to={`/theaters/${movie?.id || 1}`}>
            Change theater
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default SeatSelection;