import express from "express";
const router = express.Router();
import authController from "../controllers/auth";
import asyncHandler from "../routes/async-handler";

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));

export default router;