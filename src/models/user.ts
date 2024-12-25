import mongoose from 'mongoose';

export interface User {
  email: string;
  username: string;
  displayName?: string;
  password: string;
  refreshToken?: string[];
  _id?: string;
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