import mongoose from 'mongoose';
import { User as APIUser } from '@things-i-like/auth';

export interface User extends APIUser{
  password: string;
  refreshToken?: string[];
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