import { argon2i } from 'argon2-ffi';
import crypto from 'crypto';
import util from 'util';

import ShopModel from '@models/shop.model';
import { SignUp } from '@declareTypes/access';
import { createTokenPair } from '@auth/authUtils';
import configs from '@typeConfig/index';
import { getIntoData } from '@utils/index';
import { BadRequestError } from '@core/error.response';
import { CREATED } from '@core/success.response';

export default class AccessService {
  static signUp = async ({ name, email, password }: SignUp) => {
    const shopWithThisEmail = await ShopModel.findOne({ email });
    if (shopWithThisEmail) {
      throw new BadRequestError('Already registedx');
    }

    // passowrd
    const getRandomBytes = util.promisify(crypto.randomBytes);
    const salt = await getRandomBytes(32);
    const hashedPassword = await argon2i.hash(password, salt);

    const newShop = await ShopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [configs.userRole.SHOP],
    });

    if (newShop) {
      // TODO: Method 1: Handle JWT with Asynchonous: publicKey -> verify token, privateKey -> sign token
      // Method 2: Handle JWT with secretkey
      const tokens = await createTokenPair({
        userId: newShop._id,
      });

      return {
        statusCode: 201,
        metadata: {
          ...getIntoData({ fields: ['name', 'email', '_id'], object: newShop }),
          tokens,
        },
      };
    }

    return {
      statusCode: 201,
      metadata: null,
    };
  };
}
