import React, { useEffect, useState } from 'react';
import Post from './Post';
import postService from '../services/post-service';
import { Post as APIPost } from '@things-i-like/post';

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
        const fetchedPosts = await postService.getAll(filter? filter : {});
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => <Post key={post._id!.toString()} post={post} />)
      )}
    </div>
  );
};

export default Posts;