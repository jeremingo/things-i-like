import React, { useEffect, useState } from 'react';
import Post from './Post';
import postService from '../services/post-service';
import { Post as APIPost } from '@things-i-like/post';
import { ObjectId } from 'bson';
import { useAlert } from '../AlertContext';

interface PostsProps {
  filter: Partial<APIPost>;
}

const Posts: React.FC<Partial<PostsProps>> = ({ filter }) => {
  const [posts, setPosts] = useState<APIPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAll(filter ? filter : {});
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        showAlert('danger', 'Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter, showAlert]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  function handleDelete(postId: ObjectId): void {
    setPosts(posts.filter((post) => post._id !== postId));
    showAlert('success', 'Post deleted successfully!');
  }

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => <Post key={post._id!.toString()} post={post} onDelete={handleDelete} />)
      )}
    </div>
  );
};

export default Posts;