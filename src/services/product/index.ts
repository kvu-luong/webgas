import { BadRequestError } from '@core/error.response';
import {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  IProduct,
  ProductType,
} from '@models/product.model';
import { Schema } from 'mongoose';
// Factory pattern

export default class ProductFactory {
  /*
    type: 'Clothing',
    payload
    */
  static async createProduct({ type, payload }: { type: string; payload: IProduct }) {
    switch (type) {
      case ProductType['CLOTHING']:
        return new Clothing(payload).createProduct();
      case ProductType['ELECTRONIC']:
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
  }
}

class Product {
  product_name: string;
  product_thumb: string;
  product_description: string | undefined;
  product_price: number;
  product_type: ProductType;
  product_shop: Schema.Types.ObjectId;
  product_attributes: Schema.Types.Mixed;
  product_quantity: number;
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }: IProduct) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  async createProduct({ detailId }: { detailId: Schema.Types.ObjectId }) {
    return await ProductModel.create({ ...this, _id: detailId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError('Create new clothe error');

    const newProduct = await super.createProduct({ detailId: newClothing._id });
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create(this.product_attributes);
    if (!newElectronic) throw new BadRequestError('Create new electronic error');

    const newProduct = await super.createProduct({ detailId: newElectronic._id });
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}
