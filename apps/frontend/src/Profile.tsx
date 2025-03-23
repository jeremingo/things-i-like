import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '@things-i-like/auth';
import userService from './services/user-service';
import { ObjectId } from 'bson';
import Posts from './home/Posts';

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
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-5">User not found.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body d-flex align-items-center">
              {user.photo && (
                <img
                  src={user.photo}
                  alt={`${user.username}'s Profile`}
                  className="img-fluid rounded-circle me-4"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              )}
              <div>
                <h1 className="card-title">{user.username}'s Profile</h1>
                <p className="card-text text-muted">
                  Welcome to {user.username}'s profile page!
                </p>
              </div>
            </div>
          </div>

          <Posts filter={{ userId: user._id }} />
        </div>
      </div>
    </div>
  );
};

export default Profile;