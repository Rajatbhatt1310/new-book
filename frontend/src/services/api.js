import {
  fallbackMovies,
  fallbackTheaters,
  generateFallbackSeats,
} from "../data/dummyData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}, fallbackValue = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.info("Using fallback data:", error.message);
    return fallbackValue;
  }
}

export async function getMovies() {
  const data = await request("/movies/", {}, { results: fallbackMovies });

  if (Array.isArray(data)) {
    return data;
  }

  return data?.results || [];
}

export async function getMovieCatalog(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          searchParams.append(key, item);
        }
      });
    } else if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return request(
    `/movies/${query ? `?${query}` : ""}`,
    {},
    {
      results: fallbackMovies,
      pagination: {
        page: 1,
        page_size: 12,
        total_pages: 1,
        total_results: fallbackMovies.length,
        has_next: false,
        has_previous: false,
      },
      filters: {
        genres: [],
        languages: [],
      },
      sorting: {
        current: "name",
        allowed: ["name", "-name", "rating", "-rating", "newest", "oldest"],
      },
    }
  );
}

export async function getMovie(movieId) {
  const fallbackMovie =
    fallbackMovies.find((movie) => String(movie.id) === String(movieId)) ||
    fallbackMovies[0];

  return request(`/movies/${movieId}/`, {}, fallbackMovie);
}

export async function getTheaters(movieId) {
  const fallback = fallbackTheaters.filter(
    (theater) => String(theater.movie) === String(movieId)
  );

  return request(`/theaters/?movie=${movieId}`, {}, fallback);
}

export async function getTheater(theaterId) {
  const fallbackTheater =
    fallbackTheaters.find(
      (theater) => String(theater.id) === String(theaterId)
    ) || fallbackTheaters[0];

  return request(`/theaters/${theaterId}/`, {}, fallbackTheater);
}

export async function getSeats(theaterId) {
  return request(
    `/seats/?theater=${theaterId}`,
    {},
    generateFallbackSeats(theaterId)
  );
}

export async function createBooking(payload) {
  const fallbackBooking = {
    id: `BMS-${Date.now()}`,
    status: "Confirmed",
    ...payload,
  };

  return request(
    "/bookings/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    fallbackBooking
  );
}

export async function lockSeats(payload) {
  return request(
    "/lock-seats/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    null
  );
}

export async function confirmLockedBooking(payload) {
  return request(
    "/confirm-booking/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    null
  );
}

export async function createPaymentOrder(payload) {
  return request(
    "/create-payment-order/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    null
  );
}

export async function verifyPayment(payload) {
  return request(
    "/verify-payment/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    null
  );
}

export async function getAdminAnalytics() {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unauthorized admin access");
  }

  return response.json();
}