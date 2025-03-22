import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth";
import asyncHandler from "../routes/async-handler";
import postsController from "../controllers/post";

router.get("/", asyncHandler(postsController.getAll.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.get("/:id", asyncHandler(postsController.getById.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/", authMiddleware, asyncHandler(postsController.create.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/:id", authMiddleware, asyncHandler(postsController.update.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.delete("/:id", authMiddleware, asyncHandler(postsController.deleteItem.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/:id/like", authMiddleware, asyncHandler(postsController.like.bind(postsController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));

export default router;