import express, { Router } from 'express';
import AccessController from '@controllers/access.controller';
import { asyncHandler } from '@helpers/asyncHandler';
import { authentication } from '@auth/authUtils';

const router: Router = express.Router();
router.post('/login', asyncHandler(AccessController.login));
router.post('/signup', asyncHandler(AccessController.signUp));

router.use(authentication);
router.post('/logout', asyncHandler(AccessController.logout));
router.post('/getTokenByRefreshToken', asyncHandler(AccessController.getTokenByRefreshToken));
export default router;
