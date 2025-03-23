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
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0 text-center">Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`form-control ${formState.errors.email ? 'is-invalid' : ''}`}
                  />
                  {formState.errors.email && (
                    <div className="invalid-feedback">{formState.errors.email?.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className={`form-control ${formState.errors.password ? 'is-invalid' : ''}`}
                  />
                  {formState.errors.password && (
                    <div className="invalid-feedback">{formState.errors.password?.message}</div>
                  )}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>

                <p className="mt-3 text-center">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="btn btn-link p-0"
                  >
                    Register here
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;