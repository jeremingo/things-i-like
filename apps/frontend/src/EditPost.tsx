import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from './services/post-service';
import { ObjectId } from 'bson';
import PostForm, { PostFormData } from './PostForm';
import { Post } from '@things-i-like/post';
import { useAlert } from './AlertContext';

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const post = await postService.getById(new ObjectId(postId));
          setPost(post);
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
        showAlert('danger', 'Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, showAlert]);

  const onSubmit = async (data: PostFormData) => {
    await postService
      .update({ ...data, _id: new ObjectId(postId) })
      .then(() => {
        showAlert('success', 'Post updated successfully!');
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to update post:', err);
        showAlert('danger', 'Failed to update post. Please try again.');
      });
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  return <PostForm onSubmit={onSubmit} initialData={post} action="Update Post" />;
};

export default EditPost;