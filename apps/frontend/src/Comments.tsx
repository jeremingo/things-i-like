
import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import commentService from './services/comment-service';
import { Comment as APIPost } from '@things-i-like/comment';
import { ObjectId } from 'bson';

interface PostsProps {
  filter: Partial<APIPost>;
}

const Posts: React.FC<Partial<PostsProps>> = ({ filter }) => {
  const [comments, setComments] = useState<APIPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await commentService.getAll(filter? filter : {});
        setComments(fetchedComments);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        alert('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [filter]);

  if (loading) {
    return <p>Loading comments...</p>;
  }

  function handleDelete(commentId: ObjectId): void {
    setComments(comments.filter((comment) => comment._id !== commentId));
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Comments</h1>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => <Comment key={comment._id!.toString()} comment={comment} onDelete={handleDelete} />)
      )}
    </div>
  );
};

export default Posts;