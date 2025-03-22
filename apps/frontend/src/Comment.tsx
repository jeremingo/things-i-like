import { User } from '@things-i-like/auth';
import { Comment as APIComment } from '@things-i-like/comment';
import React, { useEffect } from 'react';
import userService from './services/user-service';
import authService from './services/auth-service';
import commentService from './services/comment-service';
import { ObjectId } from 'bson';
import { useNavigate } from 'react-router-dom';

interface CommentPorps {
  comment: APIComment;
  onDelete: (postId: ObjectId) => void;
}

const Comment: React.FC<CommentPorps> = ({ comment, onDelete }) => {
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
    userService.getById(comment.postId).then((user) => setUser(user));
  }, [comment.postId]);
  
  function handleDelete(): void {
    commentService.deleteItem(comment._id!).then(() => {
      alert('comment deleted successfully!');
      onDelete(comment._id!);
    });
  }

  function handleEdit(): void {
    navigate(`/edit-comment/${comment._id}`);
  }

  return (
    <>{ isLoggedIn && authService.getUserId() === comment.userId &&
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
      <p style={{ margin: '0 0 16px 0', color: '#555' }}>{comment.content}</p>
      <p style={{ margin: '0', fontStyle: 'italic', color: '#777' }}>Comment by: {user?.username}</p>
    </div></>
  );
};

export default Comment;