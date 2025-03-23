import { User } from '@things-i-like/auth';
import { Comment as APIComment } from '@things-i-like/comment';
import React, { useEffect } from 'react';
import userService from './services/user-service';
import authService from './services/auth-service';
import commentService from './services/comment-service';
import { ObjectId } from 'bson';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from './AlertContext';

interface CommentProps {
  comment: APIComment;
  onDelete: (postId: ObjectId) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onDelete }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = React.useState(authService.isLoggedIn());
  const { showAlert } = useAlert();

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(authService.isLoggedIn());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    userService.getById(comment.userId).then((user) => setUser(user));
  }, [comment.userId]);

  function handleDelete(): void {
    commentService.deleteItem(comment._id!)
      .then(() => {
        showAlert('success', 'Comment deleted successfully!');
        onDelete(comment._id!);
      })
      .catch((err) => {
        console.error('Failed to delete comment:', err);
        showAlert('danger', 'Failed to delete comment. Please try again.');
      });
  }

  function handleEdit(): void {
    navigate(`/edit-comment/${comment._id}`);
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="card-text text-secondary mb-0">{comment.content}</p>
          <p className="card-text">
            <small className="text-muted">Comment by: {user?.username}</small>
          </p>
        </div>

        {isLoggedIn && authService.getUserId() === comment.userId && (
          <div>
            <FontAwesomeIcon
              icon={faEdit}
              className="text-primary me-3"
              style={{ cursor: 'pointer' }}
              onClick={handleEdit}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="text-danger"
              style={{ cursor: 'pointer' }}
              onClick={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;