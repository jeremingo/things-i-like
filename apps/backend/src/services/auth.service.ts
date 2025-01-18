import userModel, { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";
import Tokens from "../controllers/tokens";
import Config from "../env/config";

export interface CreateUserRequestBody {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}

const register = async (req: CreateUserRequestBody): Promise<User> => {
  return await userModel.create({
    ...req,
    password: await bcrypt.hash(req.password, await bcrypt.genSalt(10)),
  });
};

export type JwtPayload = {
  userId: mongoose.Types.ObjectId,
  random: string
};

const generateToken = (userId: mongoose.Types.ObjectId): Tokens => {
  const payload = { userId: userId, random: Math.random().toString() };
  
  return {
    accessToken: jwt.sign(
      payload,
      Config.JWT_SECRET,
      { expiresIn: Config.TOKEN_EXPIRES }
    ),
    refreshToken: jwt.sign(
      payload,
      Config.JWT_SECRET,
      { expiresIn: Config.REFRESH_TOKEN_EXPIRES }
    ),
    userId: userId
  };
};

export interface LoginRequestBody {
  email: string;
  password: string;
}

const login = async (req: LoginRequestBody): Promise<Tokens> => {
  const user = await userModel.findOne({ email: req.email });

  if (!user || !await bcrypt.compare(req.password, user.password)) {
    throw new Error("wrong username or password");
  }
  
  const tokens = generateToken(user._id);

  if (!user.refreshToken) {
    user.refreshToken = [];
  }

  user.refreshToken.push(tokens.refreshToken);
  await user.save();

  return tokens;
};

type tUser = Document<unknown, object, User> &
  User &
  Required<{ _id: mongoose.Types.ObjectId }> &
  { __v: number };

const verifyRefreshToken = async (refreshToken: string | undefined): Promise<tUser> => {
  if (!refreshToken) {
    throw new Error("fail");
  }

  const decoded = jwt.verify(refreshToken, Config.JWT_SECRET) as JwtPayload;

  const user = await userModel.findById(decoded.userId);

  if (!user) {
    throw new Error("fail");
  }
  if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
    user.refreshToken = [];
    await user.save();
    throw new Error("fail");
  }
  
  user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
  await user.save();

  return user;
};

export interface RefreshTokenBody {
  refreshToken: string;
}

const logout = async (req: RefreshTokenBody): Promise<void> => {
  const user = await verifyRefreshToken(req.refreshToken);
  await user.save();
};

const refresh = async (req: RefreshTokenBody): Promise<Tokens> => {
  const user = await verifyRefreshToken(req.refreshToken);
  if (!user) {
    throw new Error("fail");
  }

  const tokens = generateToken(user._id);

  if (!user.refreshToken) {
    user.refreshToken = [];
  }
  user.refreshToken.push(tokens.refreshToken);
  await user.save();

  return tokens;
};

const verifyAccessToken = (token: string) => {
  if (!token) {
    throw new Error("Access Denied");
  }

  return jwt.verify(token, Config.JWT_SECRET) as JwtPayload;
};

export default {
  register,
  login,
  refresh,
  logout,
  verifyAccessToken
};
