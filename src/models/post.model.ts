import mongoose from 'mongoose';

export interface Post {
  userId: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  _id?: mongoose.Types.ObjectId;
}

const postSchema = new mongoose.Schema<Post>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, },
  title: { type: String, required: true },
  content: { type: String, required: false, }
});

const postModel = mongoose.model<Post>("Posts", postSchema);

export default postModel;