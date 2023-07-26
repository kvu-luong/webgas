import { ShopFields } from '@declareTypes/access';
import shopModel from '@models/shop.model';
import { Types } from 'mongoose';

const defaultSelectFields = {
  email: 1,
  password: 2,
  name: 1,
  status: 1,
  roles: 1,
};

export const findShopByEmail = async ({
  email,
  select = defaultSelectFields,
}: {
  email: string;
  select?: ShopFields;
}) => {
  return await shopModel.findOne({ email }).select(select);
};

export const findShopById = async ({
  userId,
  select = defaultSelectFields,
}: {
  userId: string;
  select?: ShopFields;
}) => {
  return await shopModel.findOne({ _id: new Types.ObjectId(userId) }).select(select);
};
