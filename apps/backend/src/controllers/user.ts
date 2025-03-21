import userModel, { User } from "../models/user";
import { Request, Response } from "express";
import BaseController from "./base-controller";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

class UserController extends BaseController<User> {
  constructor() {
    super(userModel);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async create(this: UserController, req: Request<object, object, User>, res: Response<User | Error>): Promise<void> {
    res.status(StatusCodes.FORBIDDEN).send();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteItem(this: UserController, req: Request<{ id: mongoose.Types.ObjectId}>, res: Response<Error>): Promise<void> {
    res.status(StatusCodes.FORBIDDEN).send();
  }
}

export default new UserController()