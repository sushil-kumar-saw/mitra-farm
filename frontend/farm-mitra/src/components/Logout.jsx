import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutButton.module.css'; // Import the CSS module

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session data (e.g., localStorage, cookies)
    localStorage.removeItem('authToken'); // Adjust based on your auth implementation

    // Redirect to home page
    navigate('/');
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
