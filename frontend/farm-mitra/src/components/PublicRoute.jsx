import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.success === true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // Don't show loading for public routes
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    // We don't know the role here, so redirect to home or let them choose
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

