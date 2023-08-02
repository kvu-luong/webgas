import { Schema, model, Document } from 'mongoose';
import slugify from 'slugify';

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
  product_slug: string;
  product_ratingsAverage: number;
  prouduct_variations?: Array<string>;
  isDraft: boolean;
  isPublished: boolean;
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
    product_slug: String,
    product_ratingsAverage: {
      type: Number,
      default: 3.4,
      min: [1, 'Rating must be greater or equal than 1.0'],
      max: [5, 'Rating must be less or equal  than 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    prouduct_variations: { type: Array<string>, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
// create index
productSchema.index({ product_name: 'text', product_description: 'text' });

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

export const ProductModel = model<IProduct & Document>(DOCUMENT_NAME, productSchema);

export interface IClothing extends Document {
  brand: string;
  size?: string;
  material?: string;
  product_shop: Schema.Types.ObjectId;
}
const clothingSchema = new Schema<IClothing>(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'clothes',
    timestamps: true,
  },
);
export const ClothingModel = model<IClothing & Document>(ProductType['CLOTHING'], clothingSchema);

export interface IElectronic extends Document {
  manufacturer: string;
  model?: string;
  color?: string;
  product_shop: Schema.Types.ObjectId;
}

const electronicSchema = new Schema<IElectronic>(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'electronics',
    timestamps: true,
  },
);
export const ElectronicModel = model<IClothing & Document>(
  ProductType['ELECTRONIC'],
  electronicSchema,
);

export interface IFurniture extends Document {
  brand: string;
  size?: string;
  material?: string;
  product_shop: Schema.Types.ObjectId;
}

const furnitureSchema = new Schema<IFurniture>(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collection: 'furnitures',
    timestamps: true,
  },
);
export const FurnitureModel = model<IClothing & Document>(
  ProductType['FURNITURE'],
  furnitureSchema,
);
