import jwt, { JwtPayload } from 'jsonwebtoken';
import configs from '@typeConfig/index';
import { Tokens } from '@declareTypes/auth';
import { asyncHandler } from '@helpers/asyncHandler';
import { NextFunction, Response } from 'express';
import { AuthFailureError } from '@core/error.response';
import { KeyStoreService } from '@services/keyStore';
import { Errors } from '@utils/error';
import { CustomRequest } from 'global';
import { Payload } from '@declareTypes/access';
import { IKeyStore } from '@models/keyStore.model';

export const createTokenPair = async (payload: Payload): Promise<Tokens> => {
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
  } catch (error) {
    throw new Error('Unable to generate token!!!');
  }
};

export const authentication = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // validate userId exist in the header
    const userId = req.headers[configs.header.CLIENT_ID] as string;
    if (!userId) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'z');

    // validate userId exist in the database
    const keyStoreObj: IKeyStore | null = await KeyStoreService.findByUserId(userId);
    if (!keyStoreObj) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'x');

    const refreshToken = req.headers[configs.header.REFRESH_TOKEN] as string;
    if (refreshToken) {
      try {
        const decodeUser = await verifyJWT(refreshToken, configs.commomConfig.jwt.refresh_secret);
        if (userId !== decodeUser.userId)
          throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'i');
        req.keyStoreObj = keyStoreObj;
        req.refreshToken = refreshToken;
        req.userId = userId;

        return next();
      } catch (error) {
        throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'k');
      }
    }

    // verify accessToken
    const keyStoreId = keyStoreObj._id as string;
    let accessToken = req.headers[configs.header.AUTHORIZATION] as string;
    if (!accessToken) throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message + 'e');
    accessToken = accessToken.split('Bearer ')[1];

    try {
      const decodedToken = await verifyJWT(accessToken);
      if (userId !== decodedToken?.userId)
        throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message);
      req.keyStoreId = keyStoreId?.toString(); // check and delete the sameTo use later: logout
      req.userId = userId;

      next();
    } catch (error) {
      throw new AuthFailureError(Errors.INVALID_CREDENTIAL.message);
    }
  },
);

export const verifyJWT = async (
  token: string,
  secrectKey = configs.commomConfig.jwt.access_secret,
) => {
  return (await jwt.verify(token, secrectKey)) as JwtPayload;
};
