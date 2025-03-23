import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from './services/auth-service';
import PostForm, { CommentFormData as PostFormData } from './CommentForm';
import CommentService from './services/comment-service';
import { ObjectId } from 'bson';
import { useAlert } from './AlertContext';

const NewComment: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const onSubmit = async (data: PostFormData) => {
    await CommentService.create({ ...data, postId: new ObjectId(postId) })
      .then(() => {
        showAlert('success', 'Comment created successfully!');
        navigate('/post/' + postId);
      })
      .catch((err) => {
        console.error('Failed to create comment:', err);
        showAlert('danger', 'Failed to create comment. Please try again.');
      });
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Create a New Comment</h4>
            </div>
            <div className="card-body">
              <PostForm onSubmit={onSubmit} action="Create Comment" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewComment;