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
  setError(""); // Clear previous errors
  
  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "🔄 Registering...";
  
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formData, role }),
    });

    // Handle response
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // Server returned non-JSON response
        if (response.status === 0) {
          setError("Cannot connect to server. Please check if the backend is running.");
        } else {
          setError(`Server error (${response.status}). Please try again.`);
        }
        return;
      }
      // Show the actual error message from server
      setError(errorData.message || "Registration failed. Please check your information.");
      return;
    }

    const data = await response.json();
    if (data.success) {
      // Success - navigate to login
      navigate("/auth/login");
    } else {
      setError(data.message || "Registration failed");
    }
  } catch (error) {
    // Only show network error if it's actually a network connectivity issue
    const isNetworkError = error.name === 'TypeError' && 
      (error.message.includes('fetch') || 
       error.message.includes('Failed to fetch') || 
       error.message.includes('NetworkError') ||
       error.message.includes('Network request failed'));
    
    if (isNetworkError) {
      setError("Cannot connect to server. Please ensure the backend server is running on port 3000.");
    } else {
      // For any other error, show a user-friendly message without "Network error"
      setError("Registration failed. Please check your information and try again.");
    }
  } finally {
    // Restore button state
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
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
