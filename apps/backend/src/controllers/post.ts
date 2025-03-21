import postModel from "../models/post.model";
import { Request, Response } from "express";
import BaseController from "./base-controller";
import { Post } from "@things-i-like/post";

class PostsController extends BaseController<Post> {
  constructor() {
    super(postModel);
  }

  async create(this: PostsController, req: Request<object, object, Omit<Post, 'userId'>>, res: Response<Post | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.create({ ...req, body: modifiedBody } as Request<object, object, Post>, res);
  }
}

export default new PostsController()