import { Schema, model, Document } from 'mongoose';

export enum ProductType {
  ELECTRONIC = 'Eletronics',
  CLOTHING = 'Clothing',
  FURNITURE = 'Furniture',
}

export interface IProduct extends Document {
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_price: number;
  product_quantity: number;
  product_type: ProductType;
  product_shop: Schema.Types.ObjectId;
  product_attributes: Schema.Types.Mixed;
}

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: Object.values(ProductType),
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
export const ProductModel = model<IProduct & Document>(DOCUMENT_NAME, productSchema);

export interface IClothing extends Document {
  brand: string;
  size?: string;
  material?: string;
}
const clothingSchema = new Schema<IClothing>(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: 'clothes',
    timestamps: true,
  }
);
export const ClothingModel = model<IClothing & Document>('clothe', clothingSchema);

export interface IElectronic extends Document {
  manufacturer: string;
  model?: string;
  color?: string;
}

const electronicSchema = new Schema<IElectronic>(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    collection: 'electronics',
    timestamps: true,
  }
);
export const ElectronicModel = model<IClothing & Document>('electronic', electronicSchema);
