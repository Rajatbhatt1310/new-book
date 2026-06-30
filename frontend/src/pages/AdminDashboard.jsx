import { useEffect, useState } from "react";
import { getAdminAnalytics } from "../services/api.js";

function rupees(amount) {
  return `₹${amount || 0}`;
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminAnalytics()
      .then(setAnalytics)
      .catch(() => {
        setError("Admin access only. Please login from Django admin first.");
      });
  }, []);

  if (error) {
    return (
      <section className="container section">
        <div className="form-card">
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Access denied</h1>
          <p className="muted">{error}</p>
          <a className="btn btn-primary" href="/admin/">
            Login as Admin
          </a>
        </div>
      </section>
    );
  }

  if (!analytics) {
    return (
      <section className="container section">
        <p className="muted">Loading admin analytics...</p>
      </section>
    );
  }

  return (
    <section className="container section admin-dashboard">
      <div className="page-heading">
        <span className="eyebrow">Admin Analytics</span>
        <h1>Dashboard</h1>
        <p>Real-time booking and payment insights.</p>
      </div>

      <div className="analytics-grid">
        <div className="form-card">
          <h2>Total Revenue</h2>
          <p className="analytics-number">{rupees(analytics.total_paid_revenue)}</p>
        </div>

        <div className="form-card">
          <h2>Total Bookings</h2>
          <p className="analytics-number">{analytics.total_bookings}</p>
        </div>

        <div className="form-card">
          <h2>Cancellation Rate</h2>
          <p className="analytics-number">{analytics.cancellation_rate}%</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="form-card">
          <h2>Popular Movies</h2>
          {analytics.popular_movies.map((movie) => (
            <p key={movie.id}>
              {movie.name} — {movie.total_bookings} bookings
            </p>
          ))}
        </div>

        <div className="form-card">
          <h2>Busiest Theaters</h2>
          {analytics.busiest_theaters.map((theater) => (
            <p key={theater.id}>
              {theater.name} — {theater.occupancy_rate.toFixed(1)}%
            </p>
          ))}
        </div>

        <div className="form-card">
          <h2>Peak Booking Hours</h2>
          {analytics.peak_booking_hours.map((item) => (
            <p key={item.hour}>
              {item.hour}:00 — {item.total_bookings} bookings
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;