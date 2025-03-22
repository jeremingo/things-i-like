import { ObjectId } from "bson";

export interface Comment {
  userId: ObjectId;
  postId: ObjectId;
  content: string;
  _id?: ObjectId;
}
