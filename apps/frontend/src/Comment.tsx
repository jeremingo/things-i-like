import { User } from '@things-i-like/auth';
import { Comment as APIPost } from '@things-i-like/comment';
import React, { useEffect } from 'react';
import userService from './services/user-service';
import authService from './services/auth-service';
import commentService from './services/comment-service';
import { ObjectId } from 'bson';
import { useNavigate } from 'react-router-dom';

interface PostProps {
  post: APIPost;
  onDelete: (postId: ObjectId) => void;
}

const Comment: React.FC<PostProps> = ({ post, onDelete }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate()
  const [isLoggedIn, setLoggedIn] = React.useState(authService.isLoggedIn());

  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed');
      setLoggedIn(authService.isLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    userService.getById(post.userId).then((user) => setUser(user));
  }, [post.userId]);
  
  function handleDelete(): void {
    commentService.deleteItem(post._id!).then(() => {
      alert('Post deleted successfully!');
      onDelete(post._id!);
    });
  }

  function handleEdit(): void {
    navigate(`/edit-comment/${post._id}`);
  }

  return (
    <>{ isLoggedIn && authService.getUserId() === post.userId &&
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}> 
        <button onClick={ handleEdit } style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Edit</button>
        <button onClick={ handleDelete } style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Delete</button>
      </div>
    }
    <div style={{

      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <p style={{ margin: '0 0 16px 0', color: '#555' }}>{post.content}</p>
      <p style={{ margin: '0', fontStyle: 'italic', color: '#777' }}>Posted by: {user?.username}</p>
    </div></>
  );
};

export default Comment;