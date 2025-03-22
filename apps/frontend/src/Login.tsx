import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './services/auth-service';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
  email: z.string()
    .email('Enter a valid email')
    .nonempty('Email is required'),
  password: z.string()
    .nonempty('Password is required'),
})

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = (data: FormData) => {
    authService.login(data)
      .then(() => {
        alert('Login successful');
        navigate('/');
      })
      .catch((error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Login</h2>
        <label htmlFor="email">Email</label>
        <input {...register('email')} type="email" id="email" />
        {formState.errors.email && <p>{formState.errors.email?.message}</p>}

        <label htmlFor="password">Password</label>
        <input {...register('password')} type="password" id="password" />
        {formState.errors.password && <p>{formState.errors.password?.message}</p>}

        <button type="submit" style={{ marginTop: '20px' }}>Login</button>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;