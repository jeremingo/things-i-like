import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from './services/auth-service';
import PostForm, { CommentFormData as PostFormData } from './CommentForm';
import CommentService from './services/comment-service';
import { ObjectId } from 'bson';

const NewComment: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: PostFormData) => {
    await CommentService.create({...data, postId: new ObjectId(postId)}).then(() => {
      alert('Comment created successfully!');
      navigate('/');
    }).catch((err) => {
      console.error('Failed to create comment:', err);
      alert('Failed to create comment. Please try again.');
    });
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <h1>Create a New Comment</h1>
      <PostForm onSubmit={onSubmit} action="Create Comment" />
    </div>
  );
};

export default NewComment;