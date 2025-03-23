import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ObjectId } from 'bson';
import CommentForm, { CommentFormData } from './CommentForm';
import { Comment } from '@things-i-like/comment';
import CommentService from './services/comment-service';
import commentService from './services/comment-service';
import { useAlert } from './AlertContext';

const EditComment: React.FC = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const [comment, setComment] = useState<Comment | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        if (commentId) {
          const comment = await CommentService.getById(new ObjectId(commentId));
          setComment(comment);
        }
      } catch (err) {
        console.error('Failed to fetch comment:', err);
        showAlert('danger', 'Failed to load comment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId, showAlert]);

  const onSubmit = async (data: CommentFormData) => {
    await commentService
      .update({
        ...data,
        postId: new ObjectId(comment?.postId),
        _id: new ObjectId(commentId),
      })
      .then(() => {
        showAlert('success', 'Comment updated successfully!');
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to update comment:', err);
        showAlert('danger', 'Failed to update comment. Please try again.');
      });
  };

  if (loading) {
    return <p>Loading comment...</p>;
  }

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      <h1>Edit Comment</h1>
      <CommentForm onSubmit={onSubmit} initialData={comment} action="Update Comment" />
    </div>
  );
};

export default EditComment;