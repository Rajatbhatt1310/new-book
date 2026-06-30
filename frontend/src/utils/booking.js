const BOOKINGS_KEY = "bookmyseat_bookings";
const PENDING_BOOKING_KEY = "bookmyseat_pending_booking";

export function savePendingBooking(booking) {
  sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking));
}

export function getPendingBooking() {
  const savedBooking = sessionStorage.getItem(PENDING_BOOKING_KEY);
  return savedBooking ? JSON.parse(savedBooking) : null;
}

export function clearPendingBooking() {
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
}

export function saveBooking(booking) {
  const bookings = getBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...bookings]));
}

export function getBookings() {
  const savedBookings = localStorage.getItem(BOOKINGS_KEY);
  return savedBookings ? JSON.parse(savedBookings) : [];
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
