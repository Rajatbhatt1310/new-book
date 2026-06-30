import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import MovieList from "./components/MovieList.jsx";

import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import TheaterList from "./pages/TheaterList.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import BookingSummary from "./pages/BookingSummary.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/movies"
            element={<MovieList title="Movies playing near you" />}
          />

          <Route path="/movie/:movieId" element={<MovieDetail />} />

          <Route
            path="/theaters/:movieId"
            element={<TheaterList />}
          />

          <Route
            path="/seats/:theaterId"
            element={<SeatSelection />}
          />

          <Route
            path="/booking/:theaterId"
            element={<BookingPage />}
          />

          <Route
            path="/booking-summary"
            element={<BookingSummary />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/profile" element={<Profile />} />

          {/* Task 4 Admin Analytics Dashboard */}
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;