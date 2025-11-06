import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css'; // Import the CSS file

const ChatbotRedirectButton = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/chatbot');
  };

  return (
    <button onClick={handleRedirect} className="chatbot-button">
      Learning
    </button>
  );
};

export default ChatbotRedirectButton;
