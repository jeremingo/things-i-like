import mongoose from "mongoose";
import { ObjectId } from "bson";

export interface Like {
  userId: ObjectId;
  postId: ObjectId;
}

const likeSchema = new mongoose.Schema<Like>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export default mongoose.model<Like>("Likes", likeSchema);