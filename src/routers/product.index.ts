import express, { Router } from 'express';
import { asyncHandler } from '@helpers/asyncHandler';
import { authentication } from '@auth/authUtils';
import { ProductController } from '@controllers/product.controller';

const router: Router = express.Router();

router.use(authentication);
router.post('/product', asyncHandler(ProductController.createProduct));
export default router;
