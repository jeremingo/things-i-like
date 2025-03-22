import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth";
import asyncHandler from "../routes/async-handler";
import commentController from "../controllers/comment";

router.get("/", asyncHandler(commentController.getAll.bind(commentController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.get("/:id", asyncHandler(commentController.getById.bind(commentController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/", authMiddleware, asyncHandler(commentController.create.bind(commentController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/:id", authMiddleware, asyncHandler(commentController.update.bind(commentController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.delete("/:id", authMiddleware, asyncHandler(commentController.deleteItem.bind(commentController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));

export default router;