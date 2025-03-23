import { User } from '@things-i-like/auth';
import { Post as APIPost } from '@things-i-like/post';
import React, { useEffect } from 'react';
import userService from '../services/user-service';
import authService from '../services/auth-service';
import postService from '../services/post-service';
import { ObjectId } from 'bson';
import { Link, useNavigate } from 'react-router-dom';

interface PostProps {
  post: APIPost;
  onDelete: (postId: ObjectId) => void;
}

const Post: React.FC<PostProps> = ({ post, onDelete }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate()
  const [isLoggedIn, setLoggedIn] = React.useState(authService.isLoggedIn());
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const [hasLiked, setHasLiked] = React.useState(false);

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
    postService.deleteItem(post._id!).then(() => {
      alert('Post deleted successfully!');
      onDelete(post._id!);
    });
  }

  useEffect(() => {
    if(isLoggedIn) {
      postService.hasLiked(post._id!).then((hasLiked) => setHasLiked(hasLiked));
    } else {
      setHasLiked(false);
    }
  }
  , [isLoggedIn, post._id]);


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
      { !!post.photo && <img src={post.photo} alt="Post Image" style={{ height: "230px", width: "230px" }}/> }
      <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>{post.title}</h2>
      <p style={{ margin: '0 0 16px 0', color: '#555' }}>{post.content}</p>
      <p style={{ margin: '0', fontStyle: 'italic', color: '#777' }}>Posted by: {user?.username}</p>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <button
            onClick={handleLike}
            style={{
              padding: '8px 16px',
              backgroundColor: hasLiked ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Like
          </button>
          <div>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</div>
          <Link
            to={`/post/${post._id}`}
            style={{
              textDecoration: 'none',
              color: '#007bff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
          </Link>
        </div>
    </div></>
  );
};

export default Post;