import React from 'react';
import { useParams } from 'react-router-dom';
import { getUserId } from './services/auth-service';

const Profile: React.FC = () => {
  const { userId: userId } = useParams<{ userId: string }>();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{userId}'s Profile</h1>
        {getUserId()?.toString() === userId && (
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
      <p>Welcome to {userId}'s profile page!</p>
    </div>
  );
};

export default Profile;