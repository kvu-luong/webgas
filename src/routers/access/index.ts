import express, { Router } from 'express';
import AccessController from '@controllers/access/access.controller';
const router: Router = express.Router();

router.post('/shop/signup', AccessController.signUp);

export default router;
