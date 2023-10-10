import { BadRequestError } from '@core/error.response';
import DiscountModel, { IDiscount } from '@models/discount.model';

export class DiscountService {
  static async createDiscountCode(payload: IDiscount) {
    if (new Date() < new Date(payload.start_date) || new Date() > new Date(payload.end_date)) {
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(payload.start_date) >= new Date(payload.end_date)) {
      throw new BadRequestError('Start date must be before end date');
    }

    const foundDiscount = await DiscountModel.findOne({
      code: payload.code,
      shopId: payload.shopId,
    }).lean();

    if (foundDiscount && foundDiscount.is_active) {
      throw new BadRequestError('Discount existed');
    }

    const newDiscount = await DiscountModel.create({
      ...payload,
    });

    return newDiscount;
  }

  // update discount

  // get all discount with product

  // get all discount of shop
}
