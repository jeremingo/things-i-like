import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post as User } from '@things-i-like/post';
import { ObjectId } from 'bson';
import Comments from './Comments';
import postService from './services/post-service';
import authService from './services/auth-service';

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(authService.isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const fetchedPost = await postService.getById(new ObjectId(postId));
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  function handleComment(): void {
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      navigate(`/add-comment/${post?._id}`);
    }
  }

  return (
    <><div style={{ padding: '20px' }}>
      { !!post.photo && <img src={post.photo} alt="Post Image" style={{ height: "230px", width: "230px" }}/> }
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{post.title}</h1>
      </div>
      <p>{post.content}</p>
    </div>
    <button onClick={handleComment}>Add Comment</button>
    <div>
      <Comments filter={{ postId: post._id }} />
    </div></>
  );
};

export default PostPage;
