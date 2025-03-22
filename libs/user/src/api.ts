import { User } from "@things-i-like/auth";
import { ObjectId } from "bson";

export interface UserAPI {
  getById(req: ObjectId): Promise<User>;
  getAll(req: Partial<User>): Promise<User[]>;
  update(req: Omit<User, '_id' | 'email'>): Promise<User[]>;
}