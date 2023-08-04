import inventoryModel from '@models/inventory.model';
import { Schema } from 'mongoose';

export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknow',
}: {
  productId: Schema.Types.ObjectId;
  shopId: Schema.Types.ObjectId;
  stock: number;
  location?: string;
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};
