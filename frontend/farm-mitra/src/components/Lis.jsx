import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./lis.css"
function ListRedirectButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/list');
  };

  return (
    <button className="custom-button" onClick={handleClick}>
      AI Analyzer
    </button>
  );
}

export default ListRedirectButton;
