import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from './services/user-service';
import authService from './services/auth-service';
import { User } from '@things-i-like/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  username: z.string()
    .nonempty('Username is required'),
});

type FormData = z.infer<typeof schema>;

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = authService.getUserId();
      if (userId) {
        await userService.getById(userId).then((fetchedUser) => {
          setUser(fetchedUser);
          reset(fetchedUser);
        }).catch((err) => {
        console.error('Failed to fetch user:', err);
        alert('Failed to load user details. Please try again later.');
        }).finally(() => {
          setLoading(false);
        });
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, reset]);

  const onSubmit = async (data: FormData) => {
    await userService.update(data).then(() => {
      alert('User updated successfully!');
      navigate(`/user/${user?._id}`);
    }).catch((err) => {
      console.error('Failed to update user:', err);
      alert('Failed to update user. Please try again.');
    });
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="username" style={{ fontWeight: 'bold' }}>Username</label>
        <input {...register('username')} type="text" id="username" />
        {formState.errors.username && <p>{formState.errors.username?.message}</p>}

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