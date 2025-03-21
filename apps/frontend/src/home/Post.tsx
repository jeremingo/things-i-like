import { User } from '@things-i-like/auth';
import { Post as APIPost } from '@things-i-like/post';
import React, { useEffect } from 'react';
import userService from '../services/user-service';

interface PostProps {
  post: APIPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    userService.getById(post.userId).then((user) => setUser(user));
  }, [post.userId]);
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>{post.title}</h2>
      <p style={{ margin: '0 0 16px 0', color: '#555' }}>{post.content}</p>
      <p style={{ margin: '0', fontStyle: 'italic', color: '#777' }}>Posted by: {user?.username}</p>
    </div>
  );
};

export default Post;