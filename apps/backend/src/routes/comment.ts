import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth";
import asyncHandler from "../routes/async-handler";
import commentController from "../controllers/comment";

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments.
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The comment ID.
 *                   content:
 *                     type: string
 *                     description: The comment content.
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who created the comment.
 */
router.get(
  "/",
  asyncHandler(
    commentController.getAll.bind(commentController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a specific comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to retrieve.
 *     responses:
 *       200:
 *         description: The requested comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The comment ID.
 *                 content:
 *                   type: string
 *                   description: The comment content.
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who created the comment.
 *       404:
 *         description: Comment not found.
 */
router.get(
  "/:id",
  asyncHandler(
    commentController.getById.bind(commentController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment for a post.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *                 example: This is a comment.
 *               postId:
 *                 type: string
 *                 description: The ID of the post the comment belongs to.
 *                 example: 1234567890abcdef12345678
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *       400:
 *         description: Bad request. Validation failed.
 */
router.post(
  "/",
  authMiddleware,
  asyncHandler(
    commentController.create.bind(commentController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Update a comment
 *     description: Update the content of an existing comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment.
 *                 example: Updated comment content.
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       400:
 *         description: Bad request. Validation failed.
 *       404:
 *         description: Comment not found.
 */
router.post(
  "/:id",
  authMiddleware,
  asyncHandler(
    commentController.update.bind(commentController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       404:
 *         description: Comment not found.
 */
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(
    commentController.deleteItem.bind(commentController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

export default router;