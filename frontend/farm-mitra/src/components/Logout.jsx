import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      // Call logout endpoint to clear cookie on server
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      navigate('/');
    }
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
