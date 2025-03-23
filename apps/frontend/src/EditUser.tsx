import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from './services/user-service';
import authService from './services/auth-service';
import { User } from '@things-i-like/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAlert } from './AlertContext';

const schema = z.object({
  username: z.string().nonempty('Username is required'),
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
  const { showAlert } = useAlert();
  const [imgSrc, setImgSrc] = useState<File>();
  const [imgUrl, setImgUrl] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = authService.getUserId();
      if (userId) {
        await userService
          .getById(userId)
          .then((fetchedUser) => {
            setImgUrl(fetchedUser.photo);
            setUser(fetchedUser);
            reset(fetchedUser);
          })
          .catch((err) => {
            console.error('Failed to fetch user:', err);
            showAlert('danger', 'Failed to load user details. Please try again later.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, reset, showAlert]);

  const onSubmit = async (data: FormData) => {
    await userService
      .update(data, imgSrc)
      .then(() => {
        showAlert('success', 'User updated successfully!');
        navigate(`/user/${user?._id}`);
      })
      .catch((err) => {
        console.error('Failed to update user:', err);
        showAlert('danger', 'Failed to update user. Please try again.');
      });
  };

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return <p className="text-center mt-5">Loading user details...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Edit User</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 text-center">
                  <label htmlFor="file" className="form-label fw-bold">
                    Photo
                  </label>
                  <div className="d-flex justify-content-center position-relative">
                    {(imgSrc || imgUrl) && (
                      <img
                        src={imgSrc ? URL.createObjectURL(imgSrc) : imgUrl}
                        alt="User Profile"
                        className="img-fluid rounded"
                        style={{ height: '230px', width: '230px', objectFit: 'cover' }}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary position-absolute bottom-0 end-0"
                      onClick={selectImg}
                    >
                      Select
                    </button>
                  </div>
                  <input
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    type="file"
                    onChange={imgSelected}
                  />
                </div>

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

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;