import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import BaseRepository from "../services/base-repository";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../services/not-found-error";

class BaseController<T> {
  baseRepository: BaseRepository<T>;

  constructor(model: Model<T>) {
    this.baseRepository = new BaseRepository<T>(model);
  }

  async getAll(req: Request<object, object, object, T>, res: Response<T[] | Error>) {
    try {
      res.send(await this.baseRepository.getAll(req.query));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }

  async getById(req: Request<{ id: mongoose.Types.ObjectId}>, res: Response<T | Error>) {
    try {
      res.status(StatusCodes.OK).send(await this.baseRepository.getById(req.params.id));
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
      res.status(StatusCodes.CREATED).send(await this.baseRepository.create(req.body));
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }

  async deleteItem(req: Request<{ id: mongoose.Types.ObjectId }>, res: Response<Error>) {
    try {
      await this.baseRepository.deleteItem(req.params.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error instanceof Error ? error : new Error(error as string));
    }
  }
}

export default BaseController;
