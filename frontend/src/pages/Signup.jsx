import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container auth-page">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Join BookMySeat</span>

        <h1>Signup</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <label>
          Full name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </label>

        <button
          className="btn btn-primary full-width"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="muted centered">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Signup;