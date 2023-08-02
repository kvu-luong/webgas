import { CREATED, OK } from '@core/success.response';
import { Response } from 'express';
import ProductFactory from '@services/product';
import { CustomRequest } from 'global';

export class ProductController {
  static createProduct = async (req: CustomRequest, res: Response) => {
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

  static getDraftProducts = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'Get list draft product',
      metadata: await ProductFactory.findAllDraftForShop({
        product_shop: req.body.product_shop,
      }),
    }).send(res);
  };

  static publishProduct = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'Publish product success',
      metadata: {
        result: await ProductFactory.publishProductByShop({
          product_id: req.body.product_id,
          product_shop: req.body.product_shop,
        }),
      },
    }).send(res);
  };

  static getPublishProducts = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'Get list publish product',
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.body.product_shop,
      }),
    }).send(res);
  };

  static unPublishProduct = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'Unpublish product success',
      metadata: {
        result: await ProductFactory.unPublishProductByShop({
          product_id: req.body.product_id,
          product_shop: req.body.product_shop,
        }),
      },
    }).send(res);
  };

  static searchProductByUser = async (req: CustomRequest, res: Response) => {
    return new OK({
      message: 'List product by key',
      metadata: await ProductFactory.searchProductByUser(req.params?.keySearch),
    }).send(res);
  };
}
