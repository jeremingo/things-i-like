import { User } from '@things-i-like/auth';
import { Post as APIPost } from '@things-i-like/post';
import React, { useEffect } from 'react';
import userService from '../services/user-service';
import authService from '../services/auth-service';
import postService from '../services/post-service';
import { ObjectId } from 'bson';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface PostProps {
  post: APIPost;
  onDelete: (postId: ObjectId) => void;
}

const Post: React.FC<PostProps> = ({ post, onDelete }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = React.useState(authService.isLoggedIn());
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const [hasLiked, setHasLiked] = React.useState(false);

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
    userService.getById(post.userId).then((user) => setUser(user));
  }, [post.userId]);

  function handleDelete(): void {
    postService.deleteItem(post._id!).then(() => {
      alert('Post deleted successfully!');
      onDelete(post._id!);
    });
  }

  useEffect(() => {
    if (isLoggedIn) {
      postService.hasLiked(post._id!).then((hasLiked) => setHasLiked(hasLiked));
    } else {
      setHasLiked(false);
    }
  }, [isLoggedIn, post._id]);

  function handleEdit(): void {
    navigate(`/edit-post/${post._id}`);
  }

  async function handleLike(): Promise<void> {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      if (hasLiked) {
        await postService.unlike(post._id!);
        setLikeCount((prev) => prev - 1);
        setHasLiked(false);
      } else {
        await postService.like(post._id!);
        setLikeCount((prev) => prev + 1);
        setHasLiked(true);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      alert('Failed to toggle like. Please try again.');
    }
  }

  return (
    <div className="card mb-3">
      <div className="row g-0">
        {post.photo && (
          <div className="col-md-4">
            <img
              src={post.photo}
              alt="Post Image"
              className="img-fluid rounded-start"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div className={`col-md-${post.photo ? '8' : '12'}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title">{post.title}</h5>
              {isLoggedIn && authService.getUserId() === post.userId && (
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

            <p className="card-text">{post.content}</p>
            <p className="card-text">
              <small className="text-muted">Posted by: {user?.username}</small>
            </p>
          </div>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          <button
            onClick={handleLike}
            className={`btn ${hasLiked ? 'btn-success' : 'btn-primary'} me-2`}
          >
            Like
          </button>
          <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
        </div>
        <Link to={`/post/${post._id}`} className="btn btn-link">
          {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
        </Link>
      </div>
    </div>
  );
};

export default Post;