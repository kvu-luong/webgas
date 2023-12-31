import express, { Router } from 'express';
import { asyncHandler } from '@helpers/asyncHandler';
import { authentication } from '@auth/authUtils';
import { ProductController } from '@controllers/product.controller';

const router: Router = express.Router();

router.get('/search/:keySearch', asyncHandler(ProductController.searchProductByUser));
router.get('/all', asyncHandler(ProductController.findAllProducts));
router.get('/:productId', asyncHandler(ProductController.findOneProduct));

router.use(authentication);
router.post('', asyncHandler(ProductController.createProduct));
router.get('/draft/all', asyncHandler(ProductController.getDraftProducts));
router.patch('/publishProduct', asyncHandler(ProductController.publishProduct));
router.get('/publish/all', asyncHandler(ProductController.getPublishProducts));
router.patch('/unPublishProduct', asyncHandler(ProductController.unPublishProduct));
router.patch('/updateProduct/:productId', asyncHandler(ProductController.updateProduct));
export default router;
