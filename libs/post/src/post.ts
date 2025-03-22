import { ObjectId } from "bson";

export interface Post {
  userId: ObjectId;
  title: string;
  content?: string;
  likeCount: number;
  commentCount: number;
  _id?: ObjectId;
}
