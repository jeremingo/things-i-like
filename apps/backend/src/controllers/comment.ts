import commentModel from "../models/comment.model";
import { Request, Response } from "express";
import BaseController from "./base-controller";
import { Post } from "@things-i-like/post";
import { Comment } from "@things-i-like/comment";
import mongoose, { ObjectId } from "mongoose";
import BaseRepository from "../services/base-repository";
import postModel from "../models/post.model";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../services/not-found-error";

class CommentController extends BaseController<Comment> {
  postRepository: BaseRepository<Post> = new BaseRepository<Post>(postModel);

  constructor() {
    super(commentModel);
  }

  async create(this: CommentController, req: Request<object, object, Omit<Comment, 'userId'>>, res: Response<Comment | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };
    const post = await postModel.findById(req.body.postId);

    if (!post) {
      res.status(StatusCodes.NOT_FOUND).send(new NotFoundError());
      return;
    }

    post.commentCount++;

    await post.save();
    await super.create({ ...req, body: modifiedBody } as Request<object, object, Comment>, res);
  }

  async update(this: CommentController, req: Request<{ id: ObjectId }, object, Omit<Comment, 'userId'>>, res: Response<Comment | Error>) {
    const modifiedBody = { ...req.body, userId: req.userId };

    await super.update({ ...req, body: modifiedBody } as Request<{ id: ObjectId }, object, Comment>, res);
  }
  
  async deleteItem(this: CommentController, req: Request<{ id: mongoose.Types.ObjectId }>, res: Response<Error>) {
    const comment = await commentModel.findById(req.params.id);
    const post = await postModel.findById(comment.postId);

    post.commentCount--;

    await post.save();
    await super.deleteItem(req, res);
  }
}

export default new CommentController()