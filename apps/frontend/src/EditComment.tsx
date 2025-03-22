import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ObjectId } from 'bson';
import CommentForm, { CommentFormData } from './CommentForm';
import { Comment } from '@things-i-like/comment';
import CommentService from './services/comment-service';
import commentService from './services/comment-service';

const EditComment: React.FC = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const [comment, setComment] = useState<Comment | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        if (commentId) {
          const comment = await CommentService.getById(new ObjectId(commentId));
          setComment(comment);
        }
      } catch (err) {
        console.error('Failed to fetch comment:', err);
        alert('Failed to load comment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  const onSubmit = async (data: CommentFormData) => {
    await commentService.update({
      ...data,
      postId: new ObjectId(comment?.postId),
      _id: new ObjectId(commentId)
    }).then(() => {
      alert('Comment updated successfully!');
      navigate('/');
    }).catch((err) => {
      console.error('Failed to update comment:', err);
      alert('Failed to update comment. Please try again.');
    });
  };

  if (loading) {
    return <p>Loading comment...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Comment</h1>
      <CommentForm onSubmit={onSubmit} initialData={comment} action="Update Comment" />
    </div>
  );
};

export default EditComment;