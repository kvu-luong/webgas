import express, { Router } from 'express';
import AccessController from '@controllers/access.controller';
import { asyncHandler } from '@helpers/asyncHandler';
import { authentication } from '@auth/authUtils';

const router: Router = express.Router();
router.post('/shop/login', asyncHandler(AccessController.login));
router.post('/shop/signup', asyncHandler(AccessController.signUp));

router.use(authentication);
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/getTokenByRefreshToken', asyncHandler(AccessController.getTokenByRefreshToken));
export default router;
