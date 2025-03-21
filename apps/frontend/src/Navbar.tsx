import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService, { getUserId, isLoggedIn } from './services/auth-service';
import { Tokens } from '@things-i-like/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(isLoggedIn());

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed');
      setLoggedIn(isLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    }
  }, []);

  const handleProfileClick = () => {
    if(loggedIn) {
      navigate('/user/' + getUserId());
    } else {
      navigate('/login');
    }
  };
  
  const handleLogout = () => {
    authService.logout({ refreshToken: (JSON.parse(localStorage.getItem('tokens') || '{}') as Tokens).refreshToken });
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
    }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '18px',
        color: 'white',
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Home</Link>
        <Link to="/login" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Register</Link>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div onClick={handleProfileClick} style={{
          cursor: 'pointer',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          Profile 
        </div>
        { loggedIn && (
          <div onClick={ handleLogout } style={{
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}>
            Log out
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;