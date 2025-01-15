import mongoose from "mongoose";

interface Tokens {
  accessToken: string,
  refreshToken: string,
  userId: mongoose.Types.ObjectId
};

export default Tokens;