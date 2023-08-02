import { FilterOneProduct } from '@declareTypes/product';
import { IProduct, ProductModel } from '@models/product.model';
import { Types } from 'mongoose';

export const findAllForShop = async (
  filter: Record<string, string | number | boolean>,
  limit: number,
  skip: number,
) => {
  return await ProductModel.find(filter)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export const findOneProductByShop = async (filter: FilterOneProduct) => {
  return await ProductModel.findOne({
    product_shop: new Types.ObjectId(filter.product_shop),
    _id: new Types.ObjectId(filter.product_id),
  });
};

export const publishProduct = async (product: IProduct) => {
  const update: Partial<IProduct> = {
    isDraft: false,
    isPublished: true,
  };

  return await ProductModel.updateOne(
    {
      _id: product._id,
    },
    { $set: { ...update } },
  );
};

export const unPublishProduct = async (product: IProduct) => {
  const update: Partial<IProduct> = {
    isDraft: true,
    isPublished: false,
  };

  return await ProductModel.updateOne(
    {
      _id: product._id,
    },
    { $set: { ...update } },
  );
};

export const searchProductByUser = async ({ keySearch }: { keySearch: string }) => {
  const regexSearch: RegExp = new RegExp(keySearch);
  return await ProductModel.find(
    {
      $text: { $search: regexSearch.toString() },
      isDraft: false,
    },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
};
