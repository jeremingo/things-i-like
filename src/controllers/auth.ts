import { NextFunction, Request, Response } from "express";
import userModel, { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

const register = async (req: Request, res: Response) => {
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

type Tokens = {
  accessToken: string,
  refreshToken: string,
  _id: string
};

const generateToken = (userId: string): Tokens | null => {
  if (!process.env.JWT_SECRET ||
    !process.env.TOKEN_EXPIRES ||
    !process.env.REFRESH_TOKEN_EXPIRES) {
    return null;
  }

  const random = Math.random().toString();
  
  return {
    accessToken: jwt.sign(
      { _id: userId, random: random },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    ),
    refreshToken: jwt.sign(
      { _id: userId, random: random, },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    ),
    _id: userId
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      res.status(400).send("wrong username or password");
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
  } catch (err) {
    res.status(400).send(err);
  }
};

type tUser = Document<unknown, {}, User> &
  User &
  Required<{ _id: string }> &
  { __v: number };

const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }
    
    if (!process.env.JWT_SECRET) {
      reject("fail");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }

        try {

          const user = await userModel.findById(payload._id);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("fail");
            return;
          }
          
          user.refreshToken = user.refreshToken!.filter((token) => token !== refreshToken);
          await user.save();

          resolve(user);
        } catch (err) {
          reject("fail");
          return;
        }
      }
    );
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

const refresh = async (req: Request, res: Response) => {
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
  } catch (err) {
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
  logout,
};
