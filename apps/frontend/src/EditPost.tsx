import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from './services/post-service';
import { ObjectId } from 'bson';

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const post = await postService.getById(new ObjectId(postId));
          setTitle(post.title);
          setContent(post.content || '');
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (postId) {
        await postService.update({ title, content, _id: new ObjectId(postId) });
        alert('Post updated successfully!');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to update post:', err);
      setError('Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="title" style={{ fontWeight: 'bold' }}>Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <label htmlFor="content" style={{ fontWeight: 'bold' }}>Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;