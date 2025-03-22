import { ObjectId } from "bson";
import { Post } from "./post";

export interface PostAPI {
  getById(req: ObjectId): Promise<Post>;
  getAll(req: Partial<Post>): Promise<Post[]>;
  create(req: Omit<Post, 'userId' | 'likeCount'>): Promise<Post>;
  update(req: Omit<Post, 'userId' | 'likeCount'>): Promise<Post>;
  like(req: ObjectId): Promise<void>;
  hasLiked(req: ObjectId): Promise<boolean>;
  deleteItem(req: ObjectId): Promise<void>;
  unlike(req: ObjectId): Promise<void>;
}