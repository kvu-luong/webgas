import { ShopFields } from '@declareTypes/access';
import shopModel from '@models/shop.model';

export const findShopByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}: {
  email: string;
  select?: ShopFields;
}) => {
  return await shopModel.findOne({ email }).select(select);
};

/// user bi xoa cung phai check user
