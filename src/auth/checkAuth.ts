import { findApiKeyById } from '@services/apiKey';
import { NextFunction, Request, Response } from 'express';
import { IApiKey } from '@models/apiKey.model';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

declare module 'express-serve-static-core' {
  interface Request {
    objKey?: IApiKey;
  }
}

export const apiKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      res.status(403).json({
        message: 'Forbidden Error',
      });
      return;
    }

    const objKey = await findApiKeyById(key);
    if (!objKey) {
      res.status(403).json({
        message: 'Forbidden Error',
      });
      return;
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
    return;
  }
};

export const permissionMiddleware = (
  permission: string
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.objKey?.permissions) {
      return res.status(403).json({
        message: 'permission denied',
      });
    }

    console.log('permission::', req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied',
      });
    }

    return next();
  };
};
