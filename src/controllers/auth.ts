import { NextFunction, Request, Response } from "express";
import Tokens from "./tokens";
import AuthService, { CreateUserRequestBody, LoginRequestBody, RefreshTokenBody } from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request<object, object, CreateUserRequestBody>, res: Response) => {
  try {
    res.status(StatusCodes.CREATED).send(await AuthService.register(req.body));
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};

const login = async (req: Request<object, object, LoginRequestBody>, res: Response<Tokens | Error>) => {
  try {
    res.status(StatusCodes.OK).send(await AuthService.login(req.body));
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(new Error(err as string));
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
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  try {
    req.params.userId = AuthService.verifyAccessToken(token)._id;
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
