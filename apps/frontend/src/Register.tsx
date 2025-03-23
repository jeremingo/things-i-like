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
});

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
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

  const onSubmit = async (data: FormData) => {
    await authService.register(data)
      .then(() => {
        alert('Registration successful');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0 text-center">Register</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
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

                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-bold">
                    Username
                  </label>
                  <input
                    {...register('username')}
                    type="text"
                    id="username"
                    className={`form-control ${formState.errors.username ? 'is-invalid' : ''}`}
                  />
                  {formState.errors.username && (
                    <div className="invalid-feedback">{formState.errors.username?.message}</div>
                  )}
                </div>

                {/* Password Field */}
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

                {/* Submit Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>

                {/* Login Link */}
                <p className="mt-3 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="btn btn-link p-0"
                  >
                    Login here
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

export default Register;