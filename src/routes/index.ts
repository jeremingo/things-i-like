import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/health', (req: Request, res: Response)=> {
  res.status(200).send('App is running');
});

export default router;