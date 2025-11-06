import { useNavigate } from 'react-router-dom';
import './RedirectButton.css';
function RedirectButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/community');
  };

  return (
    <button onClick={handleClick}>
      Go to Community
    </button>
  );
}

export default RedirectButton;
