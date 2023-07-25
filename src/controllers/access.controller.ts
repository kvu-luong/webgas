import { Request, Response } from 'express';
import AccessService from '@services/access';
import { CREATED, OK } from '@core/success.response';
import StatusCode from '@utils/statusCode';
import { CustomRequest } from 'global';

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
}
