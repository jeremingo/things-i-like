import { ObjectId } from "bson";

export interface Tokens {
  accessToken: string,
  refreshToken: string,
  userId: ObjectId
};
