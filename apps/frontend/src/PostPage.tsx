import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post as User } from '@things-i-like/post';
import { ObjectId } from 'bson';
import Comments from './Comments';
import postService from './services/post-service';

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <><div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{post.title}</h1>
      </div>
      <p>{post.content}</p>
    </div>
    <div>
      <Comments filter={{ userId: post._id }} />
    </div></>
  );
};

export default PostPage;
