import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from './services/post-service';
import authService from './services/auth-service';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
  title: z.string()
    .nonempty('Title is required'),
  content: z.string()
})

type FormData = z.infer<typeof schema>;

const NewPost: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: FormData) => {
    await postService.create(data).then(() => {
      alert('Post created successfully!');
      navigate('/');
    }).catch((err) => {
      console.error('Failed to create post:', err);
      alert('Failed to create post. Please try again.');
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="title" style={{ fontWeight: 'bold' }}>Title</label>
        <input {...register('title')} type="text" id="title" />
        {formState.errors.title && <p>{formState.errors.title?.message}</p>}

        <label htmlFor="content" style={{ fontWeight: 'bold' }}>Content</label>
        <textarea {...register('content')} id="content" rows={5} />
        {formState.errors.content && <p>{formState.errors.content?.message}</p>}

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
          Create Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;