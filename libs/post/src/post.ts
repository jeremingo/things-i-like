import { ObjectId } from "bson";

export interface Post {
  userId: ObjectId;
  title: string;
  content?: string;
  photo?: string;
  likeCount: number;
  commentCount: number;
  _id?: ObjectId;
}
