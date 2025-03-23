import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth";
import asyncHandler from "../routes/async-handler";
import postsController from "../controllers/post";

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID.
 *                   title:
 *                     type: string
 *                     description: The post title.
 *                   content:
 *                     type: string
 *                     description: The post content.
 */
router.get(
  "/",
  asyncHandler(
    postsController.getAll.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a specific post by its ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: The requested post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID.
 *                 title:
 *                   type: string
 *                   description: The post title.
 *                 content:
 *                   type: string
 *                   description: The post content.
 *       404:
 *         description: Post not found.
 */
router.get(
  "/:id",
  asyncHandler(
    postsController.getById.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with a title and content.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *                 example: My First Post
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *                 example: This is the content of my first post.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Bad request. Validation failed.
 */
router.post(
  "/",
  authMiddleware,
  asyncHandler(
    postsController.create.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}:
 *   post:
 *     summary: Update a post
 *     description: Update the title or content of an existing post.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the post.
 *                 example: Updated Post Title
 *               content:
 *                 type: string
 *                 description: The updated content of the post.
 *                 example: Updated content of the post.
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       400:
 *         description: Bad request. Validation failed.
 *       404:
 *         description: Post not found.
 */
router.post(
  "/:id",
  authMiddleware,
  asyncHandler(
    postsController.update.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 */
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(
    postsController.deleteItem.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     description: Like a post by its ID.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like.
 *     responses:
 *       200:
 *         description: Post liked successfully.
 *       404:
 *         description: Post not found.
 */
router.post(
  "/:id/like",
  authMiddleware,
  asyncHandler(
    postsController.like.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}/unlike:
 *   post:
 *     summary: Unlike a post
 *     description: Unlike a post by its ID.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to unlike.
 *     responses:
 *       200:
 *         description: Post unliked successfully.
 *       404:
 *         description: Post not found.
 */
router.post(
  "/:id/unlike",
  authMiddleware,
  asyncHandler(
    postsController.unlike.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /posts/{id}/has-liked:
 *   post:
 *     summary: Check if a user has liked a post
 *     description: Check if the authenticated user has liked a specific post.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to check.
 *     responses:
 *       200:
 *         description: User has liked the post.
 *       404:
 *         description: Post not found.
 */
router.post(
  "/:id/has-liked",
  authMiddleware,
  asyncHandler(
    postsController.hasLiked.bind(postsController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

export default router;