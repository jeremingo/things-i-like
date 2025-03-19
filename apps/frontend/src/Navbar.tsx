import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (localStorage.getItem('accessToken')) {
      alert('User is logged in');
    } else {
      navigate('/login');
    }
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
      <div onClick={handleProfileClick} style={{
        cursor: 'pointer',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
      }}>
        Profile 
      </div>
    </nav>
  );
};

export default Navbar;