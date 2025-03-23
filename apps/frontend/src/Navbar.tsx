import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/auth-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = React.useState(authService.isLoggedIn());

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed');
      setLoggedIn(authService.isLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    }
  }, []);

  const handleProfileClick = () => {
    if(isLoggedIn) {
      navigate('/user/' + authService.getUserId());
    } else {
      navigate('/login');
    }
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#007bff',
      padding: '10px 20px',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '18px',
        color: 'white',
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>things-i-like</Link>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        { isLoggedIn && (
          <button onClick={() => navigate('/new-post')} style={{
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
          }}>
            New Post
          </button>) }
        <FontAwesomeIcon onClick={handleProfileClick} style={{
          cursor: 'pointer',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }} icon={faUser}/>
        { isLoggedIn && (
          <>
          <FontAwesomeIcon onClick={() => navigate('/settings')} style={{
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }} icon={faGear} />
          <FontAwesomeIcon onClick={handleLogout} style={{
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }} icon={faRightFromBracket} /></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;