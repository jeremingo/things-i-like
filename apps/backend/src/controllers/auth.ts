import { NextFunction, Request, Response } from "express";
import { Tokens, LoginRequestBody } from "@things-i-like/auth";
import AuthService, { CreateUserRequestBody, RefreshTokenBody } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request<object, object, CreateUserRequestBody>, res: Response) => {
  try {
    res.status(StatusCodes.CREATED).send(await AuthService.register(req.body));
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};

const login = async (req: Request<object, object, LoginRequestBody>, res: Response<Tokens | { error: string }>) => {
  try {
    res.status(StatusCodes.OK).send(await AuthService.AuthService.login(req.body));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).send({ error: (err as Error).message });
  }
};

const logout = async (req: Request<object, object, RefreshTokenBody>, res: Response) => {
  try {
    res.status(StatusCodes.OK).send(await AuthService.logout(req.body));
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("fail");
  }
};

const refresh = async (req: Request<object, object, RefreshTokenBody>, res: Response) => {
  try {
    res.status(StatusCodes.OK).send(await AuthService.refresh(req.body));
  } catch {
    res.status(StatusCodes.BAD_REQUEST).send("fail");
  }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("Authorization");
  const token = authorization && authorization.split(" ")[1];

  try {
    req.userId = AuthService.verifyAccessToken(token).userId;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).send("Access Denied");
  }
};

export default {
  register,
  login,
  refresh,
  logout
};
