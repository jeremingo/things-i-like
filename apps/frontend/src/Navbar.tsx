import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#007bff',
      padding: '10px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        fontSize: '18px',
        color: 'white',
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Home</Link>
        <Link to="/login" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Login</Link>
        <Link to="/register" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;