import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from './services/post-service';
import authService from './services/auth-service';
import PostForm, { PostFormData } from './PostForm';

const NewPost: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: PostFormData) => {
    await postService.create(data).then(() => {
      alert('Post created successfully!');
      navigate('/');
    }).catch((err) => {
      console.error('Failed to create post:', err);
      alert('Failed to create post. Please try again.');
    });
  };

  return (
    <PostForm onSubmit={onSubmit} action="Create Post" />
  );
};

export default NewPost;