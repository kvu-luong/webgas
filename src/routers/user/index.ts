const express = require('express');
import { Request, Response } from 'express'; // type express
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'user',
  });
});

export default router;
