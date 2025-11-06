// ButtonList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buttonConfig } from './buttonConfig';
import "./add.css"

function ButtonList() {
  const navigate = useNavigate();

  return (
    <div>
      {buttonConfig.map(({ id, label, icon: Icon, path }) => (
        <button key={id} onClick={() => navigate(path)}>
          <Icon style={{ marginRight: '8px' }} />
          {label}
        </button>
      ))}
    </div>
  );
}

export default ButtonList;
