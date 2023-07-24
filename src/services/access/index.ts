import { argon2i } from 'argon2-ffi';
import crypto from 'crypto';
import util from 'util';

import ShopModel from '@models/shop.model';
import { SignUp } from '@declareTypes/access';
import { createTokenPair } from '@auth/authUtils';
import configs from '@typeConfig/index';
import { getIntoData } from '@utils/index';

export default class AccessService {
  static signUp = async ({ name, email, password }: SignUp) => {
    try {
      const shopWithThisEmail = await ShopModel.findOne({ email }).lean();
      if (shopWithThisEmail) {
        return {
          code: 'success',
          message: 'already registed',
        };
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
        // TODO: Method 1: Asynchonous: publicKey -> verify token, privateKey -> sign token
        // Method 2: handle return JWT with secretkey
        const tokens = await createTokenPair({
          userId: newShop._id,
        });
        return {
          code: 201,
          metadata: {
            ...getIntoData({ fields: ['name', 'email', '_id'], object: newShop }),
            tokens,
          },
        };
      }

      return {
        code: 201,
        metadata: null,
      };
    } catch (error: any) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}
