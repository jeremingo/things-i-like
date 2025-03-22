import mongoose from 'mongoose';
import { Comment } from '@things-i-like/comment';

const commentSchema = new mongoose.Schema<Comment>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true, },
});

const commentModel = mongoose.model<Comment>("Comments", commentSchema);

export default commentModel;