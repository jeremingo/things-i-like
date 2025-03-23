import mongoose from 'mongoose';
import { Post } from '@things-i-like/post';

const postSchema = new mongoose.Schema<Post>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, },
  title: { type: String, required: true },
  content: { type: String, required: false, },
  photo: { type: String, required: false, },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
});

const postModel = mongoose.model<Post>("Posts", postSchema);

export default postModel;