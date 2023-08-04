import { Schema, model, Document } from 'mongoose';

export interface IInventory extends Document {
  inven_productId: Schema.Types.ObjectId;
  inven_location: string;
  inven_stock: number;
  inven_shopId: Schema.Types.ObjectId;
  inven_reservations: string[];
}

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema<IInventory>(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    inven_location: {
      type: String,
      default: 'unknow',
    },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model<IInventory & Document>(DOCUMENT_NAME, inventorySchema);
