import { ObjectId } from "bson";

export interface Post {
  userId: ObjectId;
  title: string;
  content?: string;
  _id?: ObjectId;
}
