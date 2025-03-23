import { ObjectId } from "bson";

export interface User {
  email: string;
  username: string;
  displayName?: string;
  photo?: string;
  _id?: ObjectId;
}