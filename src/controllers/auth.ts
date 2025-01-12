import { NextFunction, Request, Response } from "express";
import userModel, { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import Tokens from "./tokens";
import Config from "../env/config";
import { StatusCodes } from "http-status-codes";

interface CreateUserRequestBody {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}

const register = async (req: Request<object, object, CreateUserRequestBody>, res: Response) => {
  try {
    res.status(StatusCodes.CREATED).send(await userModel.create({
      email: req.body.email,
      username: req.body.username,
      displayName: req.body.displayName,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    }));
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};

type JwtPayload = {
  _id: string,
  random: string
};

const generateToken = (userId: string): Tokens => {
  const payload = { _id: userId, random: Math.random().toString() };
  
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
      res.status(StatusCodes.BAD_REQUEST).send(new Error("wrong username or password"));
      return;
    }
    
    const tokens = generateToken(user._id);

    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(StatusCodes.OK).send(tokens);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(new Error(err as string));
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

  const decoded = jwt.verify(refreshToken, Config.JWT_SECRET) as JwtPayload;

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
    res.status(StatusCodes.OK).send("success");
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("fail");
  }
};

const refresh = async (req: Request<object, object, RefreshTokenBody>, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).send("fail");
      return;
    }
    const tokens = generateToken(user._id);

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.status(StatusCodes.OK).send(tokens);
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("fail");
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
    res.status(StatusCodes.UNAUTHORIZED).send("Access Denied");
    return;
  }

  jwt.verify(token, Config.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(StatusCodes.UNAUTHORIZED).send("Access Denied");
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
