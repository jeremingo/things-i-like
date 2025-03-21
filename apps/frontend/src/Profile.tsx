import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import authService from './services/auth-service';
import { User } from '@things-i-like/auth';
import userService from './services/user-service';
import { ObjectId } from 'bson';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const fetchedUser = await userService.getById(new ObjectId(userId));
          setUser(fetchedUser);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{user.username}'s Profile</h1>
        {authService.getUserId()?.toString() === userId && (
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => alert('Redirect to settings page')}
          >
            Settings
          </button>
        )}
      </div>
      <p>Welcome to {user.username}'s profile page!</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;