import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import commentService from './services/comment-service';
import { Comment as APIPost } from '@things-i-like/comment';
import { ObjectId } from 'bson';
import { useAlert } from './AlertContext';

interface PostsProps {
  filter: Partial<APIPost>;
}

const Posts: React.FC<Partial<PostsProps>> = ({ filter }) => {
  const [comments, setComments] = useState<APIPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await commentService.getAll(filter ? filter : {});
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        showAlert('danger', 'Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [filter, showAlert]);

  if (loading) {
    return <p>Loading comments...</p>;
  }

  function handleDelete(commentId: ObjectId): void {
    setComments(comments.filter((comment) => comment._id !== commentId));
    showAlert('success', 'Comment deleted successfully!');
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment._id!.toString()} comment={comment} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default Posts;