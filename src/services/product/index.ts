import { BadRequestError } from '@core/error.response';
import { FilterOneProduct } from '@declareTypes/product';
import {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
  IProduct,
  ProductType,
} from '@models/product.model';
import {
  findAllForShop,
  findOneProductByShop,
  publishProduct,
  searchProductByUser,
  unPublishProduct,
} from '@models/repositories/product.repo';
import { Schema } from 'mongoose';
// Factory pattern

export default class ProductFactory {
  /*
    type: 'Clothing',
    payload
    */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static productRegistry: Record<string, any> = {}; // type-class

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerProductType(type: string, classRef: any) {
    ProductFactory.productRegistry[type] = classRef;
  }
  // Apply strategy pattern
  static async createProduct({ type, payload }: { type: string; payload: IProduct }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async findAllDraftForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { product_shop, isDraft: true };
    return await findAllForShop(filter, limit, skip);
  }

  static async publishProductByShop({ product_shop, product_id }: FilterOneProduct) {
    const filter = { product_shop, product_id };
    const foundShop = await findOneProductByShop(filter);
    if (!foundShop) return false;
    const publishProductOK = await publishProduct(foundShop);
    if (publishProductOK.modifiedCount) return true;
    return false;
  }

  static async findAllPublishForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const filter = { product_shop, isPublished: true };
    return await findAllForShop(filter, limit, skip);
  }

  static async unPublishProductByShop({ product_shop, product_id }: FilterOneProduct) {
    const filter = { product_shop, product_id };
    const foundShop = await findOneProductByShop(filter);
    if (!foundShop) return false;
    const unPublishProductOK = await unPublishProduct(foundShop);
    if (unPublishProductOK.modifiedCount) return true;
    return false;
  }

  static async searchProductByUser(keySearch: string) {
    return await searchProductByUser({ keySearch });
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
  product_ratingsAverage?: number;
  product_variations?: string[];
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
    product_ratingsAverage,
    prouduct_variations,
  }: IProduct) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
    this.product_ratingsAverage = product_ratingsAverage;
    this.product_variations = prouduct_variations;
  }

  async createProduct({ detailId }: { detailId: Schema.Types.ObjectId }) {
    return await ProductModel.create({ ...this, _id: detailId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new clothe error');

    const newProduct = await super.createProduct({ detailId: newClothing._id });
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('Create new electronic error');

    const newProduct = await super.createProduct({ detailId: newElectronic._id });
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct({ detailId: newFurniture._id });
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }
}

ProductFactory.registerProductType(ProductType['CLOTHING'], Clothing);
ProductFactory.registerProductType(ProductType['ELECTRONIC'], Electronic);
ProductFactory.registerProductType(ProductType['FURNITURE'], Furniture);
