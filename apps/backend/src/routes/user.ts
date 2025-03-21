import express from "express";
const router = express.Router();
import asyncHandler from "../routes/async-handler";
import userController from "../controllers/user";
import { authMiddleware } from "../controllers/auth";

router.get("/", asyncHandler(userController.getAll.bind(userController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.get("/:id", asyncHandler(userController.getById.bind(userController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));
router.post("/:id", authMiddleware, asyncHandler(userController.update.bind(userController) as (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>));

export default router;