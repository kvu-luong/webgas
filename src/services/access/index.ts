import ShopModel from '@models/shop.model';
import configs from '@typeConfig/index';
import { Login, SignUp } from '@declareTypes/access';
import { createTokenPair } from '@auth/authUtils';
import { getIntoData } from '@utils/index';
import { AuthFailureError, BadRequestError } from '@core/error.response';
import { generateHashPassword, validatePassword } from '@helpers/common';
import { findShopByEmail } from './shop';
import StatusCode from '@utils/statusCode';
import { KeyStoreService } from '@services/keyStore';
import { Tokens } from '@declareTypes/auth';
import { DeleteResult } from 'mongodb';

export default class AccessService {
  static login = async ({ email, password, refreshToken = null }: Login) => {
    // verify email
    const shopWithThisEmail = await findShopByEmail({ email });
    if (!shopWithThisEmail) {
      throw new BadRequestError('Shop is not exist!');
    }

    // // verify password
    const hashPassword = shopWithThisEmail.password as string;
    const isValidPassword = await validatePassword(hashPassword, password);
    if (!isValidPassword) throw new AuthFailureError('Authentication error');

    // create AT and RT
    const tokens: Tokens = await createTokenPair({
      userId: shopWithThisEmail._id,
    });

    // save RT
    const userId = shopWithThisEmail._id;
    await KeyStoreService.saveRefreshToken({
      userId: userId.toString(),
      refreshToken: tokens.refreshToken,
    });

    return {
      statusCode: StatusCode.CREATED,
      metadata: {
        ...getIntoData({ fields: ['name', 'email', '_id'], object: shopWithThisEmail }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }: SignUp) => {
    const shopWithThisEmail = await ShopModel.findOne({ email });
    if (shopWithThisEmail) {
      throw new BadRequestError('Already registed');
    }

    const hashPasword = await generateHashPassword(password);
    const newShop = await ShopModel.create({
      name,
      email,
      password: hashPasword,
      roles: [configs.userRole.SHOP],
    });

    if (newShop) {
      // TODO: Method 1: Handle JWT with Asynchonous: publicKey -> verify token, privateKey -> sign token
      // Method 2: Handle JWT with secretkey
      const tokens = await createTokenPair({
        userId: newShop._id,
      });

      return {
        statusCode: StatusCode.CREATED,
        metadata: {
          ...getIntoData({ fields: ['name', 'email', '_id'], object: newShop }),
          tokens,
        },
      };
    }

    return {
      statusCode: StatusCode.CREATED,
      metadata: null,
    };
  };

  static logout = async (keyStoreId: string): Promise<boolean> => {
    const delKey = await KeyStoreService.removeById(keyStoreId);
    return !!delKey.deletedCount;
  };
}
