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
    };
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!post) {
    return <p className="text-center mt-5">Post not found.</p>;
  }

  function handleComment(): void {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/add-comment/${post?._id}`);
    }
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm mb-4">
            <div className="row g-0">
              {post.photo && (
                <div className="col-md-4">
                  <img
                    src={post.photo}
                    alt="Post Image"
                    className="img-fluid rounded-start"
                    style={{ objectFit: 'cover', height: '100%' }}
                  />
                </div>
              )}

              <div className={`col-md-${post.photo ? '8' : '12'}`}>
                <div className="card-body">
                  <h1 className="card-title">{post.title}</h1>
                  <p className="card-text">{post.content}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-primary" onClick={handleComment}>
              Add Comment
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Comments</h5>
            </div>
            <div className="card-body">
              <Comments filter={{ postId: post._id }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
