import "../styles/home.css";
import "../styles/Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:          "",
    email:         "",
    password:      "",
    confirmPassword: "",
    role:          "User",
    availableFrom: "",
    availableTo:   "",
  });

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (form.role === "Therapist" && (!form.availableFrom || !form.availableTo)) {
      setError("Please set your availability hours."); return;
    }
    if (form.role === "Therapist" && form.availableTo <= form.availableFrom) {
      setError("End time must be after start time."); return;
    }

    setLoading(true);
    try {
      const payload = {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
        ...(form.role === "Therapist" && {
          availableFrom: form.availableFrom,
          availableTo:   form.availableTo,
        }),
      };

      const res = await axiosInstance.post("/auth/register", payload);
      const data = res.data;

      // Auto-login after registration
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role",   data.role);
      localStorage.setItem("name",   form.name);

      if (data.role === "Therapist") navigate("/therapist");
      else navigate("/home");   

    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-content" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <p className="register-sub">Join us to book or provide therapy sessions</p>

          {error && <p className="msg-error" style={{ marginBottom: "16px" }}>{error}</p>}

          {/* Name */}
          <div className="reg-field">
            <label>Full Name</label>
            <input
              className="mytextBox"
              type="text"
              name="name"
              placeholder="Dr. Priya / John Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="reg-field">
            <label>Email</label>
            <input
              className="mytextBox"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="reg-field">
            <label>Password</label>
            <input
              className="mytextBox"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="reg-field">
            <label>Confirm Password</label>
            <input
              className="mytextBox"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Role */}
          <div className="reg-field">
            <label>I am registering as</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${form.role === "User" ? "role-active" : ""}`}
                onClick={() => setForm(prev => ({ ...prev, role: "User" }))}
              >
                👤 User
              </button>
              <button
                type="button"
                className={`role-btn ${form.role === "Therapist" ? "role-active" : ""}`}
                onClick={() => setForm(prev => ({ ...prev, role: "Therapist" }))}
              >
                🩺 Therapist
              </button>
            </div>
          </div>

          {/* Availability — only shown for Therapist */}
          {form.role === "Therapist" && (
            <div className="reg-field">
              <label>Your Availability Window</label>
              <div className="avail-row">
                <input
                  className="mytextBox avail-input"
                  type="time"
                  name="availableFrom"
                  value={form.availableFrom}
                  onChange={handleChange}
                />
                <span className="avail-sep">→</span>
                <input
                  className="mytextBox avail-input"
                  type="time"
                  name="availableTo"
                  value={form.availableTo}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            className="myButton"
            style={{ width: "100%", marginTop: "24px" }}
            onClick={handleSubmit}
            type="button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="reg-login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;