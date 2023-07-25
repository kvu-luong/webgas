import { Request, Response, NextFunction } from 'express';
import AccessService from '@services/access';
import { CREATED } from '@core/success.response';

export default class AccessController {
  static signUp = async (req: Request, res: Response) => {
    const { statusCode, metadata } = await AccessService.signUp(req.body);
    new CREATED({
      message: 'Regsiterd OK!',
      metadata,
      statusCode,
    }).send(res);
  };
}
