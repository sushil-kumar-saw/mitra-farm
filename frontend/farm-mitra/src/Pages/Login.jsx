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
  
  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "🔄 Logging in...";
  
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    const loginData = { ...formData, role };
    
    console.log('Login attempt:', { email: formData.email, role, apiUrl: `${API_BASE_URL}/auth/login` });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Parse response (try JSON first, fallback to text)
    let data;
    try {
      const responseText = await response.text();
      console.log('Response text:', responseText);
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Server returned non-JSON response
      if (response.status === 0) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError(`Server error (${response.status}). Please try again.`);
      }
      return;
    }

    console.log('Parsed data:', data);

    // Handle response
    if (!response.ok) {
      // Show the actual error message from server
      const errorMessage = data.message || data.error || `Login failed (${response.status})`;
      console.error("Login failed:", { status: response.status, errorMessage, data });
      setError(errorMessage);
      return;
    }

    // Success case
    if (data.success) {
      console.log('Login successful:', data);
      // Success - navigate to dashboard
      navigate(role === "farmer" ? "/farmer" : "/buyer");
    } else {
      console.error('Login response not successful:', data);
      setError(data.message || "Login failed");
    }
  } catch (error) {
    // Only show network error if it's actually a network connectivity issue
    // Check for fetch-related errors (TypeError) which indicate network problems
    const isNetworkError = error.name === 'TypeError' && 
      (error.message.includes('fetch') || 
       error.message.includes('Failed to fetch') || 
       error.message.includes('NetworkError') ||
       error.message.includes('Network request failed'));
    
    if (isNetworkError) {
      setError("Cannot connect to server. Please ensure the backend server is running on port 3000.");
    } else {
      // For any other error, show a user-friendly message without "Network error"
      setError("Login failed. Please check your credentials and try again.");
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
