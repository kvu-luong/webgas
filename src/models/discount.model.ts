import { Schema, model, Document } from 'mongoose';

export interface IDiscount extends Document {
  name: string;
  description: string;
  type: string;
  value: number;
  code: string;
  start_date: Date;
  end_date: Date;
  max_uses: number;
  used_count: number;
  user_used: string[];
  max_uses_per_user: number;
  min_order_value: number;
  shopId: Schema.Types.ObjectId;
  is_active: boolean;
  applies_to: string;
  product_ids: string[];
}

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema<IDiscount>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: { type: String, default: 'fixed_amount' },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    max_uses: { type: Number, required: true },
    used_count: { type: Number, required: true },
    user_used: { type: [String], default: [] },
    max_uses_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    is_active: { type: Boolean, default: true },
    applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    product_ids: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model<IDiscount & Document>(DOCUMENT_NAME, discountSchema);
