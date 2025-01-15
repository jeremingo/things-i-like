import mongoose from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    userId?: mongoose.Types.ObjectId;
  }
}