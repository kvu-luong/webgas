import { FilterOneProduct, TFindAllProduct } from '@declareTypes/product';
import { IProduct, ProductModel } from '@models/product.model';
import { getSelectData, unSelectData } from '@utils/index';
import { Model, Types } from 'mongoose';

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

export const findAllProduct = async ({ limit, sort, page, filter, select }: TFindAllProduct) => {
  const skip = (page - 1) * limit;
  const sortBy: Record<string, any> = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

export const findOneProduct = async ({
  productId,
  unSelectFields = [],
}: {
  productId: string;
  unSelectFields: string[];
}): Promise<IProduct | undefined | null> => {
  return await ProductModel.findById(new Types.ObjectId(productId))
    .select(unSelectData(unSelectFields))
    .lean();
};

export const findByIdAndUpdate = async <T>({
  productId,
  payload,
  isNew = true,
  model,
}: {
  productId: string;
  payload: Partial<T>;
  isNew?: boolean;
  model: Model<T>;
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};
