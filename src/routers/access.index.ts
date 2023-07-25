import express, { Router } from 'express';
import AccessController from '@controllers/access.controller';
import { asyncHandler } from '@auth/checkAuth';

const router: Router = express.Router();
router.post('/shop/signup', asyncHandler(AccessController.signUp));

export default router;
