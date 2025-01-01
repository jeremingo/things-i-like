import { NextFunction, Request, Response } from "express";
import userModel, { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import Tokens from "./tokens";

interface CreateUserRequestBody {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}

const register = async (req: Request<object, object, CreateUserRequestBody>, res: Response) => {
  try {
    res.status(200).send(await userModel.create({
      email: req.body.email,
      username: req.body.username,
      displayName: req.body.displayName,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    }));
  } catch (err) {
    res.status(400).send(err);
  }
};

type JwtPayload = {
  _id: string,
  random: string
};

const generateToken = (userId: string): Tokens | null => {
  if (!process.env.JWT_SECRET ||
    !process.env.TOKEN_EXPIRES ||
    !process.env.REFRESH_TOKEN_EXPIRES) {
    return null;
  }

  const payload = { _id: userId, random: Math.random().toString() };
  
  return {
    accessToken: jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    ),
    refreshToken: jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    ),
    _id: userId
  };
};

interface LoginRequestBody {
  email: string;
  password: string;
}

const login = async (req: Request<object, object, LoginRequestBody>, res: Response<Tokens | Error>) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      res.status(400).send(new Error("wrong username or password"));
      return;
    }
    
    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).send(new Error("Server Error"));
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send(tokens);
  } catch (err) {
    res.status(400).send(new Error(err as string));
  }
};

type tUser = Document<unknown, object, User> &
  User &
  Required<{ _id: string }> &
  { __v: number };

const verifyRefreshToken = async (refreshToken: string | undefined): Promise<tUser> => {
  if (!refreshToken) {
    throw new Error("fail");
  }
  
  if (!process.env.JWT_SECRET) {
    throw new Error("fail");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET) as JwtPayload;

  const user = await userModel.findById(decoded._id);

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

interface RefreshTokenBody {
  refreshToken: string;
}

const logout = async (req: Request<object, object, RefreshTokenBody>, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch {
    res.status(400).send("fail");
  }
};

const refresh = async (req: Request<object, object, RefreshTokenBody>, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("fail");
      return;
    }
    const tokens = generateToken(user._id);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.status(200).send(tokens);
  } catch {
    res.status(400).send("fail");
  }
};

type Payload = {
  _id: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }
  if (!process.env.JWT_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }
    req.params.userId = (payload as Payload)._id;
    next();
  });
};

export default {
  register,
  login,
  refresh,
  logout
};
