import { CREATED } from '@core/success.response';
import { NextFunction, Response } from 'express';
import ProductFactory from '@services/product';
import { CustomRequest } from 'global';

export class ProductController {
  static createProduct = async (req: CustomRequest, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Create Product Success',
      metadata: await ProductFactory.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shop: req.userId,
        },
      }),
    }).send(res);
  };
}
