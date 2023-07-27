import ShopModel from '@models/shop.model';
import configs from '@typeConfig/index';
import { Login, SignUp } from '@declareTypes/access';
import { createTokenPair } from '@auth/authUtils';
import { getIntoData } from '@utils/index';
import { AuthFailureError, BadRequestError, ForbiddenError } from '@core/error.response';
import { generateHashPassword, validatePassword } from '@helpers/common';
import { findShopByEmail, findShopById } from './shop';
import StatusCode from '@utils/statusCode';
import { KeyStoreService } from '@services/keyStore';
import { Tokens } from '@declareTypes/auth';
import { IKeyStore } from '@models/keyStore.model';

export default class AccessService {
  static login = async ({ email, password }: Login) => {
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
      userId: shopWithThisEmail._id?.toString(),
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
        userId: newShop._id?.toString(),
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

  static getTokenByRefreshToken = async ({
    refreshToken,
    keyStoreObj,
    userId,
  }: {
    refreshToken: string;
    userId: string;
    keyStoreObj: IKeyStore;
  }) => {
    // checking refreshTokenUsed
    // checking refreshToken
    // create a new tokens
    // update refreshTokenUsed and refreshToken

    if (keyStoreObj.refreshTokensUsed.includes(refreshToken)) {
      // delete this suspect, may update notify and retry option here
      await KeyStoreService.removeByUserId(userId);
      throw new ForbiddenError('Something went wrong with authentication !!! Please relogin');
    }

    if (keyStoreObj.refreshToken !== refreshToken)
      throw new AuthFailureError('Shop not registered');

    const foundShop = await findShopById({ userId });
    if (!foundShop) throw new AuthFailureError('Shop not registered.');

    const tokens = await createTokenPair({
      userId,
    });

    await KeyStoreService.updateToken({
      keyStoreId: keyStoreObj._id?.toString(),
      newRefreshToken: tokens.refreshToken,
      refreshTokenUsed: refreshToken,
    });

    return {
      user: {
        userId,
        email: foundShop.email,
      },
      tokens,
    };
  };
}
