import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './services/auth-service';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string()
    .email('Enter a valid email')
    .nonempty('Email is required'),
  username: z.string()
    .nonempty('Username is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .nonempty('Password is required'),
})

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    await authService.register(data).then(() => {
      console.log('Registration successful');
      navigate('/login');
    }).catch((err) => {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    });
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Register</h2>

        <label htmlFor="email">Email</label>
        <input {...register('email')} type="email" id="email" />
        {formState.errors.email && <p>{formState.errors.email?.message}</p>}

        <label htmlFor="username">Username</label>
        <input {...register('username')} type="text" id="username" />
        {formState.errors.username && <p>{formState.errors.username?.message}</p>}

        <label htmlFor="password">Password</label>
        <input {...register('password')} type="password" id="password" />
        {formState.errors.password && <p>{formState.errors.password?.message}</p>}

        <button type="submit" style={{ marginTop: '20px' }}>Register</button>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;