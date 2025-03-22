import commentModel from "../models/comment.model";
import { Request, Response } from "express";
import BaseController from "./base-controller";
import { Post } from "@things-i-like/post";
import { Comment } from "@things-i-like/comment";
import { ObjectId } from "mongoose";
import BaseRepository from "../services/base-repository";
import postModel from "../models/post.model";

class CommentController extends BaseController<Comment> {
  postRepository: BaseRepository<Post> = new BaseRepository<Post>(postModel);

  constructor() {
    super(commentModel);
  }

  async create(this: CommentController, req: Request<object, object, Omit<Comment, 'userId'>>, res: Response<Comment | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.create({ ...req, body: modifiedBody } as Request<object, object, Comment>, res);
  }

  async update(this: CommentController, req: Request<{ id: ObjectId }, object, Omit<Comment, 'userId'>>, res: Response<Comment | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.update({ ...req, body: modifiedBody } as Request<{ id: ObjectId }, object, Comment>, res);
  }
}

export default new CommentController()