import postModel from "../models/post.model";
import { Request, Response } from "express";
import BaseController from "./base-controller";
import { Post } from "@things-i-like/post";
import { ObjectId } from "mongoose";
import { ObjectId as BSONObjectId } from "bson";
import BaseRepository from "../services/base-repository";
import likeModel, { Like } from "../models/like.model";
import NotFoundError from "../services/not-found-error";
import { StatusCodes } from "http-status-codes";

class PostsController extends BaseController<Post> {
  likeRepository: BaseRepository<Like> = new BaseRepository(likeModel);

  constructor() {
    super(postModel);
  }

  async create(this: PostsController, req: Request<object, object, Omit<Post, 'userId'>>, res: Response<Post | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.create({ ...req, body: modifiedBody } as Request<object, object, Post>, res);
  }

  async update(this: PostsController, req: Request<{ id: ObjectId }, object, Omit<Post, 'userId'>>, res: Response<Post | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.update({ ...req, body: modifiedBody } as Request<{ id: ObjectId }, object, Post>, res);
  }

  async like(this: PostsController, req: Request<{ id: BSONObjectId }, object, object>, res: Response<void | Error>) {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      res.status(StatusCodes.NOT_FOUND).send(new NotFoundError());
      return;
    }

    try {
      await this.likeRepository.create({ postId: req.params.id, userId: req.userId });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).send(new Error(err as string));
      return;
    }

    post.likeCount++;

    await post.save();


    res.status(StatusCodes.OK).send();
  }

  async hasLiked(this: PostsController, req: Request<{ id: BSONObjectId }, object, object>, res: Response<boolean | Error>) {
    const like: Like[] = await this.likeRepository.getAll({ postId: req.params.id, userId: req.userId });

    res.status(StatusCodes.OK).send(like.length > 0);
  }

  async unlike(this: PostsController, req: Request<{ id: BSONObjectId }, object, object>, res: Response<void | Error>) {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      res.status(StatusCodes.NOT_FOUND).send(new NotFoundError());
      return;
    }

    post.likeCount--;

    await post.save();

    await this.likeRepository.deleteAll({ postId: req.params.id, userId: req.userId });

    res.status(StatusCodes.OK).send();
  }
}

export default new PostsController()