import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import BaseService from "../services/base.service";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../services/not-found-error";

class BaseController<T> {
  baseService: BaseService<T>;

  constructor(model: Model<T>) {
    this.baseService = new BaseService<T>(model);
  }

  async getAll(req: Request<object, object, object, T>, res: Response<T[] | Error>) {
    try {
      res.send(await this.baseService.getAll(req.query));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }

  async getById(req: Request<{ id: mongoose.Types.ObjectId}>, res: Response<T | Error>) {
    try {
      res.status(StatusCodes.OK).send(await this.baseService.getById(req.params.id));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(StatusCodes.NOT_FOUND).send(error);
      } else {
        res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
      }
    }
  }

  async create(req: Request<object, object, T>, res: Response<T | Error>) {
    try {
      res.status(StatusCodes.CREATED).send(await this.baseService.create(req.body));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }

  async deleteItem(req: Request<{ id: mongoose.Types.ObjectId }>, res: Response<Error>) {
    try {
      await this.baseService.deleteItem(req.params.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }
}

export default BaseController;
