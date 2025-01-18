import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

router.get('/health', (req: Request, res: Response)=> {
  res.status(StatusCodes.OK).send('App is running');
});

export default router;