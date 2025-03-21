import mongoose from 'mongoose';
import { User as APIUser } from '@things-i-like/auth';
import _ from 'lodash';

export interface User extends APIUser{
  password: string;
  refreshToken?: string[];
}

export const toAPIUser = (user: User): APIUser => {
  if (user instanceof mongoose.Document) {
    user = user.toObject() as User;
  }

  return _.omit(user, "password", "refreshToken");
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true, },
  username: { type: String, required: true, unique: true, },
  displayName: { type: String, required: false, },
  password: { type: String, required: true, },
  refreshToken: { type: [String], default: [] }
});

const userModel = mongoose.model<User>("Users", userSchema);

export default userModel;