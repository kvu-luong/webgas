import jwt, { JwtPayload } from 'jsonwebtoken';
import configs from '@typeConfig/index';
import { Tokens } from '@declareTypes/auth';
import { asyncHandler } from '@helpers/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import { AuthFailureError, NotFoudError } from '@core/error.response';
import { KeyStoreService } from '@services/keyStore';
import { Errors } from '@utils/error';
import { CustomRequest } from 'global';

export const createTokenPair = async (payload: string | Buffer | object): Promise<Tokens> => {
  const { access_secret, access_expiration, refresh_secret, refresh_expiration } =
    configs.commomConfig.jwt;
  try {
    const accessToken = await jwt.sign(payload, access_secret, {
      expiresIn: access_expiration,
    });

    const refreshToken = await jwt.sign(payload, refresh_secret, {
      expiresIn: refresh_expiration,
    });

    jwt.verify(accessToken, access_secret, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error: any) {
    return error;
  }
};

export const authentication = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // validate userId exist in the header
    const userId = req.headers[configs.header.CLIENT_ID] as string;
    if (!userId) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'z');

    // validate userId exist in the database
    const keyStoreObj = await KeyStoreService.findByUserId(userId);
    if (!keyStoreObj) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'x');

    // verify accessToken
    let accessToken = req.headers[configs.header.AUTHORIZATION] as string;
    if (!accessToken) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'e');
    accessToken = accessToken.split('Bearer ')[1];

    const keyStoreId = keyStoreObj._id as string;
    try {
      const decodedToken = jwt.verify(
        accessToken,
        configs.commomConfig.jwt.access_secret
      ) as JwtPayload;
      if (userId !== decodedToken?.userId)
        throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message);
      req.keyStoreId = keyStoreId?.toString(); // check and delete the sameTo use later: logout

      next();
    } catch (error) {
      throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message);
    }
  }
);
