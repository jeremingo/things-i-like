import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from './services/post-service';
import authService from './services/auth-service';
import PostForm, { PostFormData } from './PostForm';
import { useAlert } from './AlertContext';

const NewPost: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: PostFormData) => {
    await postService
      .create(data)
      .then(() => {
        showAlert('success', 'Post created successfully!');
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to create post:', err);
        showAlert('danger', 'Failed to create post. Please try again.');
      });
  };

  return <PostForm onSubmit={onSubmit} action="Create Post" />;
};

export default NewPost;