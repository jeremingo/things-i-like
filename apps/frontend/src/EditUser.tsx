import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from './services/user-service';
import authService from './services/auth-service';
import { User } from '@things-i-like/auth';

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = authService.getUserId();
        if (userId) {
          const fetchedUser = await userService.getById(userId);
          setUser(fetchedUser);
          setUsername(fetchedUser.username);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to load user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (user) {
        await userService.update({ username });
        alert('User updated successfully!');
        navigate(`/user/${user._id}`);
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="username" style={{ fontWeight: 'bold' }}>Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;