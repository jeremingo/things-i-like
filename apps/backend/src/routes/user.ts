import express from "express";
const router = express.Router();
import asyncHandler from "../routes/async-handler";
import userController from "../controllers/user";
import { authMiddleware } from "../controllers/auth";

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                   username:
 *                     type: string
 *                     description: The user's username.
 *                   email:
 *                     type: string
 *                     description: The user's email.
 */
router.get(
  "/",
  asyncHandler(
    userController.getAll.bind(userController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a specific user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: The requested user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID.
 *                 username:
 *                   type: string
 *                   description: The user's username.
 *                 email:
 *                   type: string
 *                   description: The user's email.
 *       404:
 *         description: User not found.
 */
router.get(
  "/:id",
  asyncHandler(
    userController.getById.bind(userController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

/**
 * @swagger
 * /users/{id}:
 *   post:
 *     summary: Update a user
 *     description: Update the details of an existing user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The updated username of the user.
 *                 example: updatedUser123
 *               email:
 *                 type: string
 *                 description: The updated email of the user.
 *                 example: updateduser@example.com
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request. Validation failed.
 *       404:
 *         description: User not found.
 */
router.post(
  "/:id",
  authMiddleware,
  asyncHandler(
    userController.update.bind(userController) as (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => Promise<void>
  )
);

export default router;