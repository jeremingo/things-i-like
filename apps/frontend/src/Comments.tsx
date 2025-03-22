
import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import commentService from './services/comment-service';
import { Comment as APIPost } from '@things-i-like/comment';
import { ObjectId } from 'bson';

interface PostsProps {
  filter: Partial<APIPost>;
}

const Posts: React.FC<Partial<PostsProps>> = ({ filter }) => {
  const [posts, setPosts] = useState<APIPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await commentService.getAll(filter? filter : {});
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  function handleDelete(postId: ObjectId): void {
    setPosts(posts.filter((post) => post._id !== postId));
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Comments</h1>
      {posts.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        posts.map((post) => <Comment key={post._id!.toString()} post={post} onDelete={handleDelete} />)
      )}
    </div>
  );
};

export default Posts;