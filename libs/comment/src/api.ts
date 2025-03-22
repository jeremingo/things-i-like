import { ObjectId } from "bson";
import { Comment } from "./comment";

export interface CommentAPI {
  getAll(filter: Partial<Comment>): Promise<Comment[]>;
  create(req: Omit<Comment, 'userId'>): Promise<Comment>;
  update(req: Omit<Comment, 'userId'>): Promise<Comment>;
  deleteItem(req: ObjectId): Promise<void>;
}