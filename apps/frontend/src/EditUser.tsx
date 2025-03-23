import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  const [imgSrc, setImgSrc] = useState<File>()
  const [imgUrl, setImgUrl] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userId = authService.getUserId();
      if (userId) {
        await userService.getById(userId).then((fetchedUser) => {
          setImgUrl(fetchedUser.photo)
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
    await userService.update(data, imgSrc).then(() => {
      alert('User updated successfully!');
      navigate(`/user/${user?._id}`);
    }).catch((err) => {
      console.error('Failed to update user:', err);
      alert('Failed to update user. Please try again.');
    });
  };
  
  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0])
    }
  }
  const selectImg = () => {
    console.log("Selecting image...")
    fileInputRef.current?.click()
  }

  if (loading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="file" style={{ fontWeight: 'bold' }}>Photo</label>
        <div className="d-flex justify-content-center position-relative">
          { (imgSrc || imgUrl) && <img src={imgSrc ? URL.createObjectURL(imgSrc) : imgUrl } style={{ height: "230px", width: "230px" }} className="img-fluid" />}
          <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
            Select
          </button>
        </div>
        <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>

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