import express, { Router } from 'express';
import { asyncHandler } from '@helpers/asyncHandler';
import { authentication } from '@auth/authUtils';
import { CommentController } from '@controllers/comment.controller';

const router: Router = express.Router();

router.use(authentication);
router.post('', asyncHandler(CommentController.createComment));
router.get('', asyncHandler(CommentController.getComments));
router.delete('', asyncHandler(CommentController.deleteComments));

export default router;
