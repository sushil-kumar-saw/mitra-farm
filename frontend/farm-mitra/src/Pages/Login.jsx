import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // <-- Import Link here
import "./Auth.css";
const Login = () => {
  const [role, setRole] = useState("farmer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <--- This tells fetch to send and accept cookies
      body: JSON.stringify({ ...formData, role }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `Server error: ${response.status} ${response.statusText}` };
      }
      setError(errorData.message || "Login failed");
      return;
    }

    const data = await response.json();
    if (data.success) {
      // Now token is expected to be stored as a cookie, so no need to save it manually here
      navigate(role === "farmer" ? "/farmer" : "/buyer");
    } else {
      setError(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      setError("Cannot connect to server. Please ensure the backend server is running on port 3000.");
    } else {
      setError(`Network error: ${error.message}`);
    }
  }
};


  return (
    <div className="auth-wrapper farm-bg">
      <ul className="bg-grass">
        {Array.from({ length: 30 }).map((_, i) => (
          <li key={i} style={{ left: `${i * 4}%` }}></li>
        ))}
      </ul>

      <div className="form-box fun-theme" data-tilt>
        <h2 className="form-title">🌾 Login to FarmMitra 🚜</h2>
        <div className="role-toggle">
          <button
            className={role === "farmer" ? "active" : ""}
            onClick={() => setRole("farmer")}
          >
            👨‍🌾 Farmer
          </button>
          <button
            className={role === "buyer" ? "active" : ""}
            onClick={() => setRole("buyer")}
          >
            🛒 Buyer
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">❌ {error}</p>}
          <button type="submit" className="submit-button">
            🌿 Login
          </button>
        </form>

        {/* This is the new line added */}
        <p className="register-redirect">
          Don't have an account?{" "}
          <Link to="/auth/register" className="register-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
