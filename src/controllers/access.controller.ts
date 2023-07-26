import { Request, Response } from 'express';
import AccessService from '@services/access';
import { CREATED, OK } from '@core/success.response';
import StatusCode from '@utils/statusCode';
import { CustomRequest } from 'global';
import { IKeyStore } from '@models/keyStore.model';

export default class AccessController {
  static signUp = async (req: Request, res: Response) => {
    const { statusCode, metadata } = await AccessService.signUp(req.body);
    new CREATED({
      message: 'Regsiterd OK!',
      metadata,
      statusCode,
    }).send(res);
  };

  static login = async (req: Request, res: Response) => {
    const { statusCode, metadata } = await AccessService.login(req.body);
    new OK({
      message: 'Login success',
      metadata,
      statusCode,
    }).send(res);
  };

  static logout = async (req: CustomRequest, res: Response) => {
    const isLogoutSuccess = await AccessService.logout(req?.keyStoreId as string);

    if (isLogoutSuccess) {
      return new OK({
        message: 'Logout OK!',
        statusCode: StatusCode.OK,
      }).send(res);
    }

    throw new Error('Logout Failed');
  };

  static getTokenByRefreshToken = async (req: CustomRequest, res: Response) => {
    const result = await AccessService.getTokenByRefreshToken({
      refreshToken: req.refreshToken as string,
      userId: req.userId as string,
      keyStoreObj: req.keyStoreObj as IKeyStore,
    });
    return new CREATED({
      message: 'OK!',
      metadata: result,
      statusCode: StatusCode.CREATED,
    }).send(res);
  };
}
