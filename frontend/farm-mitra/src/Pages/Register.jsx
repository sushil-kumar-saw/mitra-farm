import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [role, setRole] = useState("farmer");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL}/auth/register`, {  // note the /api prefix
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Registration failed");
      return;
    }

    const data = await response.json();
    if (data.success) {
      navigate("/login");
    } else {
      setError(data.message || "Registration failed");
    }
  } catch (error) {
    setError("Network error");
  }
};


  return (
    <div className="auth-wrapper farm-bg">
      <ul className="bg-grass">
        {Array.from({ length: 30 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      <div className="form-box fun-theme" data-tilt>
        <h2 className="form-title">🌱 Join FarmMitra 🧑‍🌾</h2>
        <div className="role-toggle">
          <button
            type="button"
            className={role === "farmer" ? "active" : ""}
            onClick={() => setRole("farmer")}
          >
            👨‍🌾 Farmer
          </button>
          <button
            type="button"
            className={role === "buyer" ? "active" : ""}
            onClick={() => setRole("buyer")}
          >
            🛒 Buyer
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="👤 Full Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <p className="error-message">❌ {error}</p>}
          <button type="submit" className="submit-button">
            🌼 Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
